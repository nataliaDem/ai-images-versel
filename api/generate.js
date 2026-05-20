const {
    generateImageDataUrl,
    readJsonBody,
    sendJson,
} = require("../lib/image-ui-backend");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    try {
        const body = await readJsonBody(req);
        const result = await generateImageDataUrl(body);
        return sendJson(res, 200, result);
    } catch (error) {
        return sendJson(res, 400, {
            error: error.message || "Failed to generate image.",
        });
    }
};
