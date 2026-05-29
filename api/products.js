const {
    getVerifiedEmbedContext,
    listProducts,
    normalizeAppEnvironment,
    sendJson,
} = require("../lib/image-ui-backend");

module.exports = async (req, res) => {
    if (req.method !== "GET") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    try {
        const embedContext = getVerifiedEmbedContext(req);
        const bakeryId = embedContext?.bakery_id || req.query?.bakeryId;
        const categoryId = req.query?.categoryId;
        const environment = normalizeAppEnvironment(embedContext?.env || req.query?.env);
        const authToken = req.headers["x-bakery-admin-token"] || "";

        if (!bakeryId || !categoryId) {
            throw new Error("bakeryId and categoryId are required.");
        }

        const products = await listProducts(bakeryId, categoryId, environment, authToken);
        return sendJson(res, 200, { products });
    } catch (error) {
        return sendJson(res, 400, {
            error: error.message || "Failed to load products.",
        });
    }
};
