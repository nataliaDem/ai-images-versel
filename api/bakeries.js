const { listBakeries, sendJson } = require("../lib/image-ui-backend");

module.exports = async (req, res) => {
    if (req.method !== "GET") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    try {
        const bakeries = await listBakeries();
        return sendJson(res, 200, { bakeries });
    } catch (error) {
        return sendJson(res, 400, {
            error: error.message || "Failed to load bakeries.",
        });
    }
};
