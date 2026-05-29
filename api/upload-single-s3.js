const {
    normalizeAppEnvironment,
    readJsonBody,
    sendJson,
    uploadSingleResultToS3,
} = require("../lib/image-ui-backend");
const { notifyActionEvent } = require("../lib/slack-notifier");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    let body = {};

    try {
        body = await readJsonBody(req);
        const environment = normalizeAppEnvironment(body.env);
        const uploaded = await uploadSingleResultToS3({
            imageDataUrl: body.imageDataUrl,
            filenameBase: body.filenameBase,
            bakeryId: body.bakeryId,
            environment,
        });

        if (body.notifySlack !== false) {
            await notifyActionEvent({
                operation: "upload",
                status: "success",
                mode: body.mode || "single",
                environment,
                bakeryId: body.bakeryId,
                bakeryName: body.bakeryName,
                categoryId: body.categoryId,
                categoryName: body.categoryName,
                itemCount: 1,
                successCount: 1,
                errorCount: 0,
                filenameBase: body.filenameBase,
                sourceType: body.sourceType,
            });
        }

        return sendJson(res, 200, { uploaded });
    } catch (error) {
        if (body.notifySlack !== false) {
            await notifyActionEvent({
                operation: "upload",
                status: "error",
                mode: body.mode || "single",
                environment: normalizeAppEnvironment(body.env),
                bakeryId: body.bakeryId,
                bakeryName: body.bakeryName,
                categoryId: body.categoryId,
                categoryName: body.categoryName,
                itemCount: 1,
                successCount: 0,
                errorCount: 1,
                filenameBase: body.filenameBase,
                sourceType: body.sourceType,
                errorMessage: error.message || "Failed to upload single image to S3.",
            });
        }

        return sendJson(res, 400, {
            error: error.message || "Failed to upload single image to S3.",
        });
    }
};
