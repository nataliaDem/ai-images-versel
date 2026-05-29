const { normalizeAppEnvironment, readJsonBody, sendJson } = require("../lib/image-ui-backend");
const { notifyActionEvent } = require("../lib/slack-notifier");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    try {
        const body = await readJsonBody(req);

        await notifyActionEvent({
            operation: body.operation || "action",
            status: body.status || "success",
            mode: body.mode || "single",
            environment: normalizeAppEnvironment(body.env),
            bakeryId: body.bakeryId,
            bakeryName: body.bakeryName,
            categoryId: body.categoryId,
            categoryName: body.categoryName,
            itemCount: body.itemCount,
            successCount: body.successCount,
            errorCount: body.errorCount,
            fileCount: body.fileCount,
            archiveName: body.archiveName,
            filenameBase: body.filenameBase,
            sourceType: body.sourceType,
            errorMessage: body.errorMessage,
        });

        return sendJson(res, 200, { ok: true });
    } catch (error) {
        return sendJson(res, 400, {
            error: error.message || "Failed to send action notification.",
        });
    }
};
