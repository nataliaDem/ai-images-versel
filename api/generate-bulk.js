const {
    readJsonBody,
    sendJson,
    streamBulkImages,
} = require("../lib/image-ui-backend");
const { notifyGenerationEvent } = require("../lib/slack-notifier");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    let body = {};

    try {
        body = await readJsonBody(req);
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

        const failedItems = results.filter((item) => item?.error);

        await notifyGenerationEvent({
            mode: "bulk",
            status: failedItems.length > 0 ? "error" : "success",
            environment: body.env,
            bakeryId: body.bakeryId,
            bakeryName: body.bakeryName,
            categoryId: body.categoryId,
            categoryName: body.categoryName,
            itemCount: Array.isArray(body.items) ? body.items.length : 0,
            successCount: results.filter((item) => item?.imageDataUrl).length,
            errorCount: failedItems.length,
            preserveOrientation: body.preserveOrientation !== false ? "yes" : "no",
            targetOrientation: body.targetOrientation,
            failedItems: failedItems.map((item) => ({
                id: item.id,
                name: item.name,
                error: item.error,
            })),
            errorMessage:
                failedItems.length > 0
                    ? `${failedItems.length} of ${results.length} items failed to generate.`
                    : "",
        });

        res.write(`${JSON.stringify({ type: "complete", results })}\n`);
        return res.end();
    } catch (error) {
        await notifyGenerationEvent({
            mode: "bulk",
            status: "error",
            environment: body.env,
            bakeryId: body.bakeryId,
            bakeryName: body.bakeryName,
            categoryId: body.categoryId,
            categoryName: body.categoryName,
            itemCount: Array.isArray(body.items) ? body.items.length : 0,
            successCount: 0,
            errorCount: Array.isArray(body.items) ? body.items.length || 1 : 1,
            preserveOrientation: body.preserveOrientation !== false ? "yes" : "no",
            targetOrientation: body.targetOrientation,
            errorMessage: error.message || "Failed to generate product batch.",
        });

        if (!res.headersSent) {
            return sendJson(res, 400, {
                error: error.message || "Failed to generate product batch.",
            });
        }

        res.write(
            `${JSON.stringify({
                type: "error",
                error: error.message || "Failed to generate product batch.",
            })}\n`,
        );
        return res.end();
    }
};
