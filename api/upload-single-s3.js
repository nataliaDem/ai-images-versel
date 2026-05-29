const {
    getVerifiedEmbedContext,
    normalizeAppEnvironment,
    readJsonBody,
    sendJson,
    uploadSingleResultToS3,
} = require("../lib/image-ui-backend");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    try {
        const body = await readJsonBody(req);
        const embedContext = getVerifiedEmbedContext(req, body);
        const uploaded = await uploadSingleResultToS3({
            imageDataUrl: body.imageDataUrl,
            filenameBase: body.filenameBase,
            bakeryId: embedContext?.bakery_id || body.bakeryId,
            environment: normalizeAppEnvironment(embedContext?.env || body.env),
        });

        return sendJson(res, 200, { uploaded });
    } catch (error) {
        return sendJson(res, 400, {
            error: error.message || "Failed to upload single image to S3.",
        });
    }
};
