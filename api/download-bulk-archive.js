const {
    buildBulkArchive,
    readJsonBody,
    sendBinary,
    sendJson,
} = require("../lib/image-ui-backend");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    try {
        const body = await readJsonBody(req);
        const archive = buildBulkArchive(body.items || []);

        return sendBinary(res, 200, archive, {
            "Content-Type": "application/zip",
            "Content-Disposition": 'attachment; filename="generated-results.zip"',
        });
    } catch (error) {
        return sendJson(res, 400, {
            error: error.message || "Failed to build the archive.",
        });
    }
};
