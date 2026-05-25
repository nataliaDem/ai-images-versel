const {
    readJsonBody,
    sendJson,
    uploadBulkResultsToS3,
} = require("../lib/image-ui-backend");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    try {
        const body = await readJsonBody(req);
        const uploads = await uploadBulkResultsToS3({
            bakeryId: body.bakeryId,
            items: body.items || [],
        });

        return sendJson(res, 200, { uploads });
    } catch (error) {
        return sendJson(res, 400, {
            error: error.message || "Failed to upload bulk images to S3.",
        });
    }
};
