const {
    normalizeAppEnvironment,
    buildBulkArchive,
    readJsonBody,
    sendBinary,
    sendJson,
} = require("../lib/image-ui-backend");
const { notifyActionEvent } = require("../lib/slack-notifier");

function sanitizeArchiveName(value) {
    return String(value || "generated-results")
        .replace(/[<>:"/\\|?*\x00-\x1F]+/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 120);
}

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    let body = {};

    try {
        body = await readJsonBody(req);
        const generationDate = new Date().toISOString().slice(0, 10);
        const bakeryName = (body.bakeryName || "bakery").trim();
        const categoryName = (body.categoryName || "category").trim();
        const archiveBaseName = sanitizeArchiveName(
            `${bakeryName}-${categoryName}-${generationDate}`,
        );
        const archive = buildBulkArchive(body.items || [], {
            folderName: archiveBaseName,
        });

        await notifyActionEvent({
            operation: "download",
            status: "success",
            mode: "bulk",
            environment: normalizeAppEnvironment(body.env),
            bakeryId: body.bakeryId,
            bakeryName: body.bakeryName,
            categoryId: body.categoryId,
            categoryName: body.categoryName,
            itemCount: Array.isArray(body.items) ? body.items.length : 0,
            successCount: Array.isArray(body.items) ? body.items.length : 0,
            errorCount: 0,
            fileCount: Array.isArray(body.items) ? body.items.length : 0,
            archiveName: archiveBaseName,
            sourceType: "generated_results",
        });

        return sendBinary(res, 200, archive, {
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename="${archiveBaseName || "generated-results"}.zip"`,
        });
    } catch (error) {
        await notifyActionEvent({
            operation: "download",
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
            errorMessage: error.message || "Failed to build the archive.",
        });

        return sendJson(res, 400, {
            error: error.message || "Failed to build the archive.",
        });
    }
};
