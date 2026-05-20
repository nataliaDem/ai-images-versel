const fs = require("fs");
const path = require("path");
const { toFile } = require("openai");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/ø/g, "o")
        .replace(/å/g, "a")
        .replace(/æ/g, "ae")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function parseList(text) {
    return text
        .trim()
        .split("\n")
        .map((line) => {
            const url = line.match(/https?:\/\/\S+/)[0];
            const name = line.replace(url, "").trim();
            return { name, url };
        });
}

function loadPrompt(filename) {
    const promptPath = path.join(__dirname, "prompts", filename);
    return fs.readFileSync(promptPath, "utf8").trim();
}

function ensureOutputDirs(bakerySlug) {
    if (!fs.existsSync("./output")) {
        fs.mkdirSync("./output");
    }

    if (!fs.existsSync(`./output/${bakerySlug}`)) {
        fs.mkdirSync(`./output/${bakerySlug}`);
    }
}

async function createImageFile(url, name) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to download image: ${url}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const extension = contentType.includes("png") ? "png" : "jpg";

    return {
        file: await toFile(buffer, `${name}.${extension}`, {
            type: contentType,
        }),
        buffer,
        contentType,
    };
}

function getPngDimensions(buffer) {
    if (buffer.length < 24) {
        throw new Error("PNG file is too small to read dimensions.");
    }

    return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
    };
}

function getJpegDimensions(buffer) {
    let offset = 2;

    while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) {
            offset += 1;
            continue;
        }

        const marker = buffer[offset + 1];

        if (marker === 0xd8 || marker === 0xd9) {
            offset += 2;
            continue;
        }

        const blockLength = buffer.readUInt16BE(offset + 2);

        if (
            marker >= 0xc0 &&
            marker <= 0xcf &&
            ![0xc4, 0xc8, 0xcc].includes(marker)
        ) {
            return {
                height: buffer.readUInt16BE(offset + 5),
                width: buffer.readUInt16BE(offset + 7),
            };
        }

        offset += 2 + blockLength;
    }

    throw new Error("Unsupported JPEG format: could not read dimensions.");
}

function getImageDimensions(buffer, contentType) {
    if (contentType.includes("png")) {
        return getPngDimensions(buffer);
    }

    if (contentType.includes("jpeg") || contentType.includes("jpg")) {
        return getJpegDimensions(buffer);
    }

    throw new Error(`Unsupported image type for dimension detection: ${contentType}`);
}

function getSizeForOrientation(dimensions, sizes, preserveOrientation) {
    if (!preserveOrientation) {
        return sizes.horizontal;
    }

    if (dimensions.width > dimensions.height) {
        return sizes.horizontal;
    }

    if (dimensions.width < dimensions.height) {
        return sizes.vertical;
    }

    return sizes.square;
}

async function runQueue(items, concurrency, handler) {
    let index = 0;

    async function worker() {
        while (index < items.length) {
            const current = items[index++];
            await handler(current);
        }
    }

    const workers = Array(concurrency).fill(null).map(worker);
    await Promise.all(workers);
}

module.exports = {
    createImageFile,
    ensureOutputDirs,
    getImageDimensions,
    getSizeForOrientation,
    loadPrompt,
    parseList,
    runQueue,
    slugify,
};
