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

function getGifDimensions(buffer) {
    if (buffer.length < 10) {
        throw new Error("GIF file is too small to read dimensions.");
    }

    return {
        width: buffer.readUInt16LE(6),
        height: buffer.readUInt16LE(8),
    };
}

function getWebpDimensions(buffer) {
    if (buffer.length < 30) {
        throw new Error("WEBP file is too small to read dimensions.");
    }

    if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
        throw new Error("Invalid WEBP file header.");
    }

    const chunkType = buffer.toString("ascii", 12, 16);

    if (chunkType === "VP8X") {
        return {
            width: 1 + buffer.readUIntLE(24, 3),
            height: 1 + buffer.readUIntLE(27, 3),
        };
    }

    if (chunkType === "VP8L") {
        const byte1 = buffer[21];
        const byte2 = buffer[22];
        const byte3 = buffer[23];
        const byte4 = buffer[24];

        return {
            width: 1 + (((byte2 & 0x3f) << 8) | byte1),
            height: 1 + (((byte4 & 0x0f) << 10) | (byte3 << 2) | ((byte2 & 0xc0) >> 6)),
        };
    }

    if (chunkType === "VP8 ") {
        return {
            width: buffer.readUInt16LE(26) & 0x3fff,
            height: buffer.readUInt16LE(28) & 0x3fff,
        };
    }

    throw new Error("Unsupported WEBP chunk type for dimension detection.");
}

function getImageDimensions(buffer, contentType) {
    if (contentType.includes("png")) {
        return getPngDimensions(buffer);
    }

    if (contentType.includes("jpeg") || contentType.includes("jpg")) {
        return getJpegDimensions(buffer);
    }

    if (contentType.includes("webp")) {
        return getWebpDimensions(buffer);
    }

    if (contentType.includes("gif")) {
        return getGifDimensions(buffer);
    }

    throw new Error(`Unsupported image type for dimension detection: ${contentType}`);
}

function getSizeForOrientation(dimensions, sizes, preserveOrientation, targetOrientation) {
    if (!preserveOrientation) {
        if (targetOrientation && sizes[targetOrientation]) {
            return sizes[targetOrientation];
        }

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
