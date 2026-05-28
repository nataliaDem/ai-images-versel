const {
    listCategories,
    normalizeAppEnvironment,
    sendJson,
} = require("../lib/image-ui-backend");

module.exports = async (req, res) => {
    if (req.method !== "GET") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    try {
        const bakeryId = req.query?.bakeryId;
        const environment = normalizeAppEnvironment(req.query?.env);

        if (!bakeryId) {
            throw new Error("bakeryId is required.");
        }

        const categories = await listCategories(bakeryId, environment);
        return sendJson(res, 200, { categories });
    } catch (error) {
        return sendJson(res, 400, {
            error: error.message || "Failed to load categories.",
        });
    }
};
