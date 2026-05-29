const {
    generateImageDataUrl,
    readJsonBody,
    sendJson,
} = require("../lib/image-ui-backend");
const { notifyGenerationEvent } = require("../lib/slack-notifier");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    let body = {};

    try {
        body = await readJsonBody(req);
        const result = await generateImageDataUrl(body);

        await notifyGenerationEvent({
            mode: "single",
            status: "success",
            environment: body.env,
            bakeryId: body.bakeryId,
            bakeryName: body.bakeryName,
            categoryId: body.categoryId,
            categoryName: body.categoryName,
            itemCount: 1,
            successCount: 1,
            errorCount: 0,
            preserveOrientation: body.preserveOrientation !== false ? "yes" : "no",
            targetOrientation: body.targetOrientation,
            sourceType: body.imageUrl ? "image_url" : "image_upload",
        });

        return sendJson(res, 200, result);
    } catch (error) {
        await notifyGenerationEvent({
            mode: "single",
            status: "error",
            environment: body.env,
            bakeryId: body.bakeryId,
            bakeryName: body.bakeryName,
            categoryId: body.categoryId,
            categoryName: body.categoryName,
            itemCount: 1,
            successCount: 0,
            errorCount: 1,
            preserveOrientation: body.preserveOrientation !== false ? "yes" : "no",
            targetOrientation: body.targetOrientation,
            sourceType: body.imageUrl ? "image_url" : "image_upload",
            errorMessage: error.message || "Failed to generate image.",
        });

        return sendJson(res, 400, {
            error: error.message || "Failed to generate image.",
        });
    }
};
