const {
    normalizeAppEnvironment,
    readJsonBody,
    sendJson,
    uploadBulkResultsToS3,
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
        const uploads = await uploadBulkResultsToS3({
            bakeryId: body.bakeryId,
            items: body.items || [],
            environment,
        });

        await notifyActionEvent({
            operation: "upload",
            status: "success",
            mode: "bulk",
            environment,
            bakeryId: body.bakeryId,
            bakeryName: body.bakeryName,
            categoryId: body.categoryId,
            categoryName: body.categoryName,
            itemCount: Array.isArray(body.items) ? body.items.length : 0,
            successCount: uploads.length,
            errorCount: Math.max((body.items || []).length - uploads.length, 0),
            fileCount: uploads.length,
            sourceType: "generated_results",
        });

        return sendJson(res, 200, { uploads });
    } catch (error) {
        await notifyActionEvent({
            operation: "upload",
            status: "error",
            mode: "bulk",
            environment: normalizeAppEnvironment(body.env),
            bakeryId: body.bakeryId,
            bakeryName: body.bakeryName,
            categoryId: body.categoryId,
            categoryName: body.categoryName,
            itemCount: Array.isArray(body.items) ? body.items.length : 0,
            successCount: 0,
            errorCount: Array.isArray(body.items) ? body.items.length || 1 : 1,
            fileCount: 0,
            sourceType: "generated_results",
            errorMessage: error.message || "Failed to upload bulk images to S3.",
        });

        return sendJson(res, 400, {
            error: error.message || "Failed to upload bulk images to S3.",
        });
    }
};
