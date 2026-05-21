const {
    buildBulkArchive,
    readJsonBody,
    sendBinary,
    sendJson,
} = require("../lib/image-ui-backend");

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

    try {
        const body = await readJsonBody(req);
        const generationDate = new Date().toISOString().slice(0, 10);
        const bakeryName = (body.bakeryName || "bakery").trim();
        const categoryName = (body.categoryName || "category").trim();
        const archiveBaseName = sanitizeArchiveName(
            `${bakeryName}-${categoryName}-${generationDate}`,
        );
        const archive = buildBulkArchive(body.items || [], {
            folderName: archiveBaseName,
        });

        return sendBinary(res, 200, archive, {
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename="${archiveBaseName || "generated-results"}.zip"`,
        });
    } catch (error) {
        return sendJson(res, 400, {
            error: error.message || "Failed to build the archive.",
        });
    }
};
