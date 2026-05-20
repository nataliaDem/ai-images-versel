require("dotenv").config();

const { toFile } = require("openai");
const OpenAI = require("openai").default;
const {
    getImageDimensions,
    getSizeForOrientation,
    runQueue,
} = require("../image-job-utils");

const fetch = (...args) =>
    import("node-fetch").then(({ default: nodeFetch }) => nodeFetch(...args));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    fetch,
});

const BAKERY_API_BASE_URL = process.env.BAKERY_API_BASE_URL || "";
const BULK_CONCURRENCY = Number(process.env.IMAGE_UI_BULK_CONCURRENCY || 4);
const SIZES = {
    horizontal: "1536x1024",
    square: "1024x1024",
    vertical: "1024x1536",
};

function sendJson(res, statusCode, payload) {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(payload));
}

function sendBinary(res, statusCode, buffer, headers = {}) {
    res.statusCode = statusCode;
    Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value);
    });
    res.setHeader("Content-Length", buffer.length);
    res.end(buffer);
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

function getBakeryApiUrl(pathname, query = {}) {
    if (!BAKERY_API_BASE_URL) {
        throw new Error("BAKERY_API_BASE_URL is not configured.");
    }

    const baseUrl = new URL(BAKERY_API_BASE_URL);
    const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const url = new URL(normalizedPath, baseUrl);

    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, String(value));
        }
    });

    return url.toString();
}

async function fetchBakeryApiJson(pathname, query) {
    const response = await fetch(getBakeryApiUrl(pathname, query));

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
}) {
    const source = await getSourceImage({ imageDataUrl, imageUrl });

    if (!prompt || !prompt.trim()) {
        throw new Error("Prompt is required.");
    }

    const size = getSizeForOrientation(
        getImageDimensions(source.buffer, source.mimeType),
        SIZES,
        preserveOrientation !== false,
    );

    const imageFile = await toFile(source.buffer, `source.${source.extension}`, {
        type: source.mimeType,
    });

    const response = await client.images.edit({
        model: "gpt-image-1",
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

async function generateBulkImages({ items, prompt, preserveOrientation }) {
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
            });

            results[item.index] = {
                id: item.id,
                name: item.name,
                imageUrl: item.imageUrl,
                imageDataUrl: generated.imageDataUrl,
                size: generated.size,
            };
        } catch (error) {
            results[item.index] = {
                id: item.id,
                name: item.name,
                imageUrl: item.imageUrl,
                error: error.message || "Failed to generate image.",
            };
        }
    });

    return results;
}

function escapeZipFilename(name) {
    return (name || "image")
        .replace(/\.[^.]+$/, "")
        .replace(/[<>:"/\\|?*\x00-\x1F]+/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 80);
}

const crcTable = (() => {
    const table = new Uint32Array(256);

    for (let index = 0; index < 256; index += 1) {
        let crc = index;

        for (let bit = 0; bit < 8; bit += 1) {
            crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
        }

        table[index] = crc >>> 0;
    }

    return table;
})();

function crc32(buffer) {
    let crc = 0xffffffff;

    for (const byte of buffer) {
        crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    }

    return (crc ^ 0xffffffff) >>> 0;
}

function dateToDos(date = new Date()) {
    const year = Math.max(1980, date.getFullYear());
    const dosTime =
        (date.getHours() << 11) |
        (date.getMinutes() << 5) |
        Math.floor(date.getSeconds() / 2);
    const dosDate =
        ((year - 1980) << 9) |
        ((date.getMonth() + 1) << 5) |
        date.getDate();

    return { dosTime, dosDate };
}

function createZipArchive(files) {
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    files.forEach((file) => {
        const filenameBuffer = Buffer.from(file.name, "utf8");
        const dataBuffer = file.data;
        const crc = crc32(dataBuffer);
        const { dosTime, dosDate } = dateToDos();

        const localHeader = Buffer.alloc(30);
        localHeader.writeUInt32LE(0x04034b50, 0);
        localHeader.writeUInt16LE(20, 4);
        localHeader.writeUInt16LE(0, 6);
        localHeader.writeUInt16LE(0, 8);
        localHeader.writeUInt16LE(dosTime, 10);
        localHeader.writeUInt16LE(dosDate, 12);
        localHeader.writeUInt32LE(crc, 14);
        localHeader.writeUInt32LE(dataBuffer.length, 18);
        localHeader.writeUInt32LE(dataBuffer.length, 22);
        localHeader.writeUInt16LE(filenameBuffer.length, 26);
        localHeader.writeUInt16LE(0, 28);

        localParts.push(localHeader, filenameBuffer, dataBuffer);

        const centralHeader = Buffer.alloc(46);
        centralHeader.writeUInt32LE(0x02014b50, 0);
        centralHeader.writeUInt16LE(20, 4);
        centralHeader.writeUInt16LE(20, 6);
        centralHeader.writeUInt16LE(0, 8);
        centralHeader.writeUInt16LE(0, 10);
        centralHeader.writeUInt16LE(dosTime, 12);
        centralHeader.writeUInt16LE(dosDate, 14);
        centralHeader.writeUInt32LE(crc, 16);
        centralHeader.writeUInt32LE(dataBuffer.length, 20);
        centralHeader.writeUInt32LE(dataBuffer.length, 24);
        centralHeader.writeUInt16LE(filenameBuffer.length, 28);
        centralHeader.writeUInt16LE(0, 30);
        centralHeader.writeUInt16LE(0, 32);
        centralHeader.writeUInt16LE(0, 34);
        centralHeader.writeUInt16LE(0, 36);
        centralHeader.writeUInt32LE(0, 38);
        centralHeader.writeUInt32LE(offset, 42);

        centralParts.push(centralHeader, filenameBuffer);
        offset += localHeader.length + filenameBuffer.length + dataBuffer.length;
    });

    const centralDirectory = Buffer.concat(centralParts);
    const endRecord = Buffer.alloc(22);
    endRecord.writeUInt32LE(0x06054b50, 0);
    endRecord.writeUInt16LE(0, 4);
    endRecord.writeUInt16LE(0, 6);
    endRecord.writeUInt16LE(files.length, 8);
    endRecord.writeUInt16LE(files.length, 10);
    endRecord.writeUInt32LE(centralDirectory.length, 12);
    endRecord.writeUInt32LE(offset, 16);
    endRecord.writeUInt16LE(0, 20);

    return Buffer.concat([...localParts, centralDirectory, endRecord]);
}

function buildBulkArchive(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("There are no generated images to archive.");
    }

    const files = items.map((item, index) => {
        const parsed = parseDataUrl(item.imageDataUrl || "");
        const baseName = escapeZipFilename(item.name || `image-${index + 1}`) || `image-${index + 1}`;

        return {
            name: `${String(index + 1).padStart(2, "0")}-${baseName}.png`,
            data: parsed.buffer,
        };
    });

    return createZipArchive(files);
}

async function listBakeries() {
    const payload = await fetchBakeryApiJson("/api/v1/store/bakeries/");
    return normalizeCollection(payload).map((bakery) => ({
        id: bakery.id,
        name: bakery.name,
    }));
}

async function listCategories(bakeryId) {
    const payload = await fetchBakeryApiJson(`/api/store/bakeries/${bakeryId}/categories`);
    return normalizeCollection(payload).map((category) => ({
        id: category.id,
        name: category.name,
    }));
}

async function listProducts(bakeryId, categoryId) {
    const payload = await fetchBakeryApiJson("/api/store/product-types/", {
        bakery_id: bakeryId,
        category_id: categoryId,
    });

    return normalizeCollection(payload)
        .map((product) => ({
            id: product.id,
            name: product.name,
            imageUrl: normalizeImageUrl(product.image?.original || ""),
        }))
        .filter((product) => product.imageUrl);
}

module.exports = {
    buildBulkArchive,
    generateBulkImages,
    generateImageDataUrl,
    listBakeries,
    listCategories,
    listProducts,
    readJsonBody,
    sendBinary,
    sendJson,
};
