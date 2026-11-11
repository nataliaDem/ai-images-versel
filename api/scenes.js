const {
    AccessError,
    deleteScene,
    getAccessibleBakeryId,
    listScenes,
    normalizeAppEnvironment,
    readJsonBody,
    renameScene,
    saveScene,
    sendJson,
} = require("../lib/image-ui-backend");

// Saved scenes library of a bakery:
// GET ?bakeryId=&env=, POST { bakeryId, env, scene }, PATCH { bakeryId, env, id, name },
// DELETE ?bakeryId=&env=&id=
module.exports = async (req, res) => {
    try {
        const hasBody = req.method === "POST" || req.method === "PATCH";
        const body = hasBody ? await readJsonBody(req) : {};
        const params = hasBody ? body : req.query || {};
        const environment = normalizeAppEnvironment(params.env);
        const { bakeryId, user } = await getAccessibleBakeryId({
            bakeryId: params.bakeryId,
            environment,
            authHeader: req.headers?.authorization || "",
        });

        if (req.method === "GET") {
            return sendJson(res, 200, { scenes: await listScenes({ bakeryId, environment }) });
        }

        if (req.method === "POST") {
            const scene = await saveScene({ bakeryId, environment, user, scene: body.scene });
            return sendJson(res, 200, { scene });
        }

        if (req.method === "PATCH") {
            const scene = await renameScene({
                bakeryId,
                environment,
                sceneId: params.id,
                name: params.name,
            });
            return sendJson(res, 200, { scene });
        }

        if (req.method === "DELETE") {
            await deleteScene({ bakeryId, environment, sceneId: params.id });
            return sendJson(res, 200, { ok: true });
        }

        return sendJson(res, 405, { error: "Method not allowed." });
    } catch (error) {
        return sendJson(res, error instanceof AccessError ? 403 : 400, {
            error: error.message || "Failed to process scenes.",
        });
    }
};
