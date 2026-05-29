const {
    buildGenerationErrorPayload,
    getVerifiedEmbedContext,
    readJsonBody,
    sendJson,
    streamBulkImages,
} = require("../lib/image-ui-backend");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    try {
        const body = await readJsonBody(req);
        getVerifiedEmbedContext(req, body);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("X-Accel-Buffering", "no");

        res.write(
            `${JSON.stringify({
                type: "start",
                total: Array.isArray(body.items) ? body.items.length : 0,
            })}\n`,
        );

        const results = await streamBulkImages({
            ...body,
            onResult({ index, total, result }) {
                res.write(
                    `${JSON.stringify({
                        type: "result",
                        index,
                        total,
                        result,
                    })}\n`,
                );
            },
        });

        res.write(`${JSON.stringify({ type: "complete", results })}\n`);
        return res.end();
    } catch (error) {
        const errorPayload = buildGenerationErrorPayload(
            error.message,
            "Failed to generate product batch.",
        );
        if (!res.headersSent) {
            return sendJson(res, 400, errorPayload);
        }

        res.write(
            `${JSON.stringify({
                type: "error",
                error: errorPayload.error,
                initial_error: errorPayload.initial_error,
            })}\n`,
        );
        return res.end();
    }
};
