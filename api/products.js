const { listProducts, sendJson } = require("../lib/image-ui-backend");

module.exports = async (req, res) => {
    if (req.method !== "GET") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    try {
        const bakeryId = req.query?.bakeryId;
        const categoryId = req.query?.categoryId;

        if (!bakeryId || !categoryId) {
            throw new Error("bakeryId and categoryId are required.");
        }

        const products = await listProducts(bakeryId, categoryId);
        return sendJson(res, 200, { products });
    } catch (error) {
        return sendJson(res, 400, {
            error: error.message || "Failed to load products.",
        });
    }
};
