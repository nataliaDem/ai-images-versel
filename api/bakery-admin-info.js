const {
    getBakeryAdminInfo,
    normalizeAppEnvironment,
    sendJson,
} = require("../lib/image-ui-backend");

module.exports = async (req, res) => {
    if (req.method !== "GET") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    try {
        const environment = normalizeAppEnvironment(req.query?.env);
        const user = await getBakeryAdminInfo(
            environment,
            req.headers?.authorization || "",
        );
        return sendJson(res, 200, { user });
    } catch (error) {
        return sendJson(res, 401, {
            error: error.message || "Failed to load bakery admin info.",
        });
    }
};
