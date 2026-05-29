require("dotenv").config();

const crypto = require("crypto");
const { File } = require("node:buffer");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { toFile } = require("openai");
const OpenAI = require("openai").default;
const {
    getImageDimensions,
    getSizeForOrientation,
    runQueue,
} = require("../image-job-utils");

const fetch = (...args) =>
    import("node-fetch").then(({ default: nodeFetch }) => nodeFetch(...args));

const BAKERY_API_BASE_URL = process.env.BAKERY_API_BASE_URL || "";
const BAKERY_API_BASE_URL_PROD =
    process.env.BAKERY_API_BASE_URL_PROD || BAKERY_API_BASE_URL || "";
const BAKERY_API_BASE_URL_STAGE =
    process.env.BAKERY_API_BASE_URL_STAGE || BAKERY_API_BASE_URL_PROD || "";
const BULK_CONCURRENCY = Number(process.env.IMAGE_UI_BULK_CONCURRENCY || 4);
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || process.env.AWS_S3_BUCKET || "";
const S3_REGION = process.env.S3_REGION || "eu-central-1";
const SIZES = {
    horizontal: "1536x1024",
    square: "1024x1024",
    vertical: "1024x1536",
};

let cachedClient;
let cachedS3Client;

if (typeof globalThis.File === "undefined") {
    globalThis.File = File;
}

function encodeBase64Url(value) {
    return Buffer.from(value)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function decodeBase64Url(value) {
    const normalized = String(value || "")
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
    return Buffer.from(`${normalized}${padding}`, "base64");
}

function getOpenAIClient() {
    if (cachedClient) {
        return cachedClient;
    }

    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not configured.");
    }

    cachedClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        fetch,
    });

    return cachedClient;
}

function getS3Client() {
    if (cachedS3Client) {
        return cachedS3Client;
    }

    if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
        throw new Error("S3 credentials are not configured.");
    }

    if (!S3_BUCKET_NAME) {
        throw new Error("S3 bucket name is not configured.");
    }

    cachedS3Client = new S3Client({
        region: S3_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });

    return cachedS3Client;
}

function sendJson(res, statusCode, payload) {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(payload));
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;

            if (body.length > 25 * 1024 * 1024) {
                reject(new Error("Request body is too large."));
                req.destroy();
            }
        });

        req.on("end", () => resolve(body));
        req.on("error", reject);
    });
}

async function readJsonBody(req) {
    const rawBody = await readBody(req);
    return JSON.parse(rawBody || "{}");
}

function normalizeCollection(payload) {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.results)) {
        return payload.results;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    if (Array.isArray(payload?.items)) {
        return payload.items;
    }

    return [];
}

function normalizeAppEnvironment(value) {
    return String(value || "").trim().toLowerCase() === "stage" ? "stage" : "production";
}

function getEmbedTokenSecret() {
    return process.env.EMBED_TOKEN_SECRET || "";
}

function parseAndVerifyEmbedToken(token) {
    if (!token) {
        return null;
    }

    const secret = getEmbedTokenSecret();

    if (!secret) {
        throw new Error("Embed token secret is not configured.");
    }

    const [encodedPayload, signature] = String(token).split(".");

    if (!encodedPayload || !signature) {
        throw new Error("Invalid token.");
    }

    const expectedSignature = encodeBase64Url(
        crypto.createHmac("sha256", secret).update(encodedPayload).digest(),
    );
    const providedSignatureBuffer = Buffer.from(signature);
    const expectedSignatureBuffer = Buffer.from(expectedSignature);

    if (
        providedSignatureBuffer.length !== expectedSignatureBuffer.length ||
        !crypto.timingSafeEqual(providedSignatureBuffer, expectedSignatureBuffer)
    ) {
        throw new Error("Invalid token.");
    }

    let payload;

    try {
        payload = JSON.parse(decodeBase64Url(encodedPayload).toString("utf-8"));
    } catch {
        throw new Error("Invalid token payload.");
    }

    if (!payload || typeof payload !== "object") {
        throw new Error("Invalid token payload.");
    }

    console.log("Embed token timing:", {
        nowSec: Math.floor(Date.now() / 1000),
        exp: payload.exp,
        remainingSec:
            typeof payload.exp === "number"
                ? payload.exp - Math.floor(Date.now() / 1000)
                : null,
    });

    if (payload.exp && Number(payload.exp) * 1000 < Date.now()) {
        throw new Error("Token expired.");
    }

    return payload;
}

function getRequestToken(req, body) {
    return req.query?.token || body?.token || "";
}

function getVerifiedEmbedContext(req, body) {
    const token = getRequestToken(req, body);

    if (!token) {
        return null;
    }

    return parseAndVerifyEmbedToken(token);
}

function getBakeryApiBaseUrl(environment) {
    const normalizedEnvironment = normalizeAppEnvironment(environment);
    const baseUrl =
        normalizedEnvironment === "stage"
            ? BAKERY_API_BASE_URL_STAGE
            : BAKERY_API_BASE_URL_PROD;

    if (!baseUrl) {
        throw new Error("Bakery API base URL is not configured.");
    }

    return baseUrl;
}

function getBakeryApiUrl(pathname, query = {}, environment = "prod") {
    const baseUrl = new URL(getBakeryApiBaseUrl(environment));
    const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const url = new URL(normalizedPath, baseUrl);

    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, String(value));
        }
    });

    return url.toString();
}

async function fetchBakeryApiJson(pathname, query, environment = "prod", headers = {}) {
    const response = await fetch(getBakeryApiUrl(pathname, query, environment), {
        headers: {
            "x-source-header": "WEB_SHOP",
            ...headers,
        },
    });

    if (!response.ok) {
        throw new Error(`Bakery API request failed with status ${response.status}.`);
    }

    return response.json();
}

function normalizeImageUrl(url) {
    if (!url) {
        return "";
    }

    if (url.startsWith("//")) {
        return `https:${url}`;
    }

    return url;
}

function normalizeProductName(name) {
    if (!name) {
        return "";
    }

    if (typeof name === "string") {
        return name.trim();
    }

    if (typeof name === "object") {
        const firstFilledValue = Object.entries(name)
            .filter(([key]) => key !== "_translatable")
            .map(([, value]) => String(value || "").trim())
            .find(Boolean);

        return firstFilledValue || "";
    }

    return String(name).trim();
}

function parseDataUrl(dataUrl) {
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

    if (!match) {
        throw new Error("Invalid image format. Expected a base64 data URL.");
    }

    const [, mimeType, base64Data] = match;
    const buffer = Buffer.from(base64Data, "base64");

    return {
        mimeType,
        buffer,
        extension: mimeType.includes("png") ? "png" : "jpg",
    };
}

function slugifyFilename(name) {
    return String(name || "image")
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 80);
}

function normalizeS3KeyPart(value) {
    return String(value || "")
        .replace(/[^a-zA-Z0-9/_-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function buildGenerationErrorPayload(initialError, fallbackMessage) {
    const message = String(initialError || "").trim();
    const detectedStatusMatch = message.match(/\b(400|429)\b/);
    const detectedStatus = detectedStatusMatch ? Number(detectedStatusMatch[1]) : 0;

    let publicError = fallbackMessage || "Generation failed.";

    if (detectedStatus === 429) {
        publicError = "The generation limit has been reached. Please try again later.";
    } else if (message.includes("Your request was rejected by the safety system")) {
        publicError =
            "This image could not be generated because the source image may contain restricted or invalid content. Please try a different image.";
    } else if (message === "Connection error." || message === "Connection error") {
        publicError = "Connection error. Please try again.";
    } else if (message) {
        publicError = `${fallbackMessage || "Generation failed."} ${message}`.trim();
    }

    return {
        error: publicError,
        initial_error: message || fallbackMessage || "Generation failed.",
    };
}

async function uploadBufferToS3({ key, buffer, contentType }) {
    const client = getS3Client();
    const normalizedKey = key.replace(/^\/+/, "");

    await client.send(
        new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: normalizedKey,
            Body: buffer,
            ContentType: contentType,
        }),
    );

    return {
        bucket: S3_BUCKET_NAME,
        key: normalizedKey,
        s3Uri: `s3://${S3_BUCKET_NAME}/${normalizedKey}`,
        url: `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${normalizedKey}`,
    };
}

async function uploadSingleResultToS3({ imageDataUrl, filenameBase, bakeryId, environment }) {
    if (!imageDataUrl) {
        throw new Error("Single result image is required.");
    }

    const parsed = parseDataUrl(imageDataUrl);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const baseName = slugifyFilename(filenameBase || "generated-image") || "generated-image";
    const normalizedEnvironment = normalizeAppEnvironment(environment);
    const bakeryPrefix = bakeryId ? `${normalizeS3KeyPart(bakeryId)}/` : "";
    const key = `ai-images/${normalizedEnvironment}/${bakeryPrefix}${timestamp}-${baseName}.${parsed.extension}`;

    return uploadBufferToS3({
        key,
        buffer: parsed.buffer,
        contentType: parsed.mimeType,
    });
}

async function getSourceImage({ imageDataUrl, imageUrl }) {
    if (imageDataUrl) {
        return parseDataUrl(imageDataUrl);
    }

    if (imageUrl) {
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error("Could not download the source image from the URL.");
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = response.headers.get("content-type") || "image/jpeg";

        if (!mimeType.startsWith("image/")) {
            throw new Error("The provided URL does not point to an image.");
        }

        return {
            mimeType,
            buffer,
            extension: mimeType.includes("png") ? "png" : "jpg",
        };
    }

    throw new Error("Source image is required.");
}

async function generateImage({
    imageDataUrl,
    imageUrl,
    prompt,
    preserveOrientation,
    targetOrientation,
}) {
    const source = await getSourceImage({ imageDataUrl, imageUrl });

    if (!prompt || !prompt.trim()) {
        throw new Error("Prompt is required.");
    }

    const size = getSizeForOrientation(
        getImageDimensions(source.buffer, source.mimeType),
        SIZES,
        preserveOrientation !== false,
        targetOrientation,
    );

    const imageFile = await toFile(source.buffer, `source.${source.extension}`, {
        type: source.mimeType,
    });

    const response = await getOpenAIClient().images.edit({
        model: "gpt-image-1.5",
        image: imageFile,
        prompt: prompt.trim(),
        size,
        quality: "medium",
    });

    const imageBase64 = response.data?.[0]?.b64_json;

    if (!imageBase64) {
        throw new Error("OpenAI Images API did not return an image.");
    }

    return {
        imageBase64,
        mimeType: "image/png",
        size,
    };
}

async function generateImageDataUrl(input) {
    const result = await generateImage(input);

    return {
        imageDataUrl: `data:${result.mimeType};base64,${result.imageBase64}`,
        size: result.size,
    };
}

async function generateBulkImages({ items, prompt, preserveOrientation, targetOrientation }) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("At least one product must be selected.");
    }

    if (!prompt || !prompt.trim()) {
        throw new Error("Prompt is required.");
    }

    const results = new Array(items.length);

    await runQueue(items.map((item, index) => ({ ...item, index })), BULK_CONCURRENCY, async (item) => {
        try {
            const generated = await generateImageDataUrl({
                imageUrl: item.imageUrl,
                prompt,
                preserveOrientation,
                targetOrientation,
            });

            results[item.index] = {
                id: item.id,
                name: item.name,
                imageUrl: item.imageUrl,
                imageDataUrl: generated.imageDataUrl,
                size: generated.size,
            };
        } catch (error) {
            const errorPayload = buildGenerationErrorPayload(
                error.message,
                "Failed to generate image.",
            );
            results[item.index] = {
                id: item.id,
                name: item.name,
                imageUrl: item.imageUrl,
                error: errorPayload.error,
                initial_error: errorPayload.initial_error,
            };
        }
    });

    return results;
}

async function streamBulkImages({
    items,
    prompt,
    preserveOrientation,
    targetOrientation,
    onResult,
}) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("At least one product must be selected.");
    }

    if (!prompt || !prompt.trim()) {
        throw new Error("Prompt is required.");
    }

    const results = new Array(items.length);

    await runQueue(
        items.map((item, index) => ({ ...item, index })),
        BULK_CONCURRENCY,
        async (item) => {
            let result;

            try {
                const generated = await generateImageDataUrl({
                    imageUrl: item.imageUrl,
                    prompt,
                    preserveOrientation,
                    targetOrientation,
                });

                result = {
                    id: item.id,
                    name: item.name,
                    imageUrl: item.imageUrl,
                    imageDataUrl: generated.imageDataUrl,
                    size: generated.size,
                };
            } catch (error) {
                const errorPayload = buildGenerationErrorPayload(
                    error.message,
                    "Failed to generate image.",
                );
                result = {
                    id: item.id,
                    name: item.name,
                    imageUrl: item.imageUrl,
                    error: errorPayload.error,
                    initial_error: errorPayload.initial_error,
                };
            }

            results[item.index] = result;

            if (typeof onResult === "function") {
                await onResult({
                    index: item.index,
                    total: items.length,
                    result,
                });
            }
        },
    );

    return results;
}

async function listProducts(bakeryId, categoryId, environment, authToken) {
    if (!authToken) {
        throw new Error("Authorization token is required.");
    }

    const payload = await fetchBakeryApiJson(
        `/api/bakeries/${bakeryId}/product-types/for-bakery-admin/`,
        {
            limit: 1000,
            category_id: categoryId,
        },
        environment,
        {
            Authorization: `JWT ${authToken}`,
        },
    );

    return normalizeCollection(payload)
        .map((product) => ({
            id: product.id,
            name: normalizeProductName(product.name),
            imageUrl: normalizeImageUrl(product.image?.original || ""),
        }))
        .filter((product) => product.imageUrl);
}

module.exports = {
    generateBulkImages,
    streamBulkImages,
    generateImageDataUrl,
    listProducts,
    getVerifiedEmbedContext,
    readJsonBody,
    sendJson,
    normalizeAppEnvironment,
    buildGenerationErrorPayload,
    uploadSingleResultToS3,
};
