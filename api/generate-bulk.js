const {
    readJsonBody,
    resolveSlackImageUrl,
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
        const chunkStart = Number(body.chunkStart || 0);
        const totalItems = Number(body.totalItems || (Array.isArray(body.items) ? body.items.length : 0));
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
            async onResult({ index, total, result }) {
                res.write(
                    `${JSON.stringify({
                        type: "result",
                        index,
                        total,
                        result,
                    })}\n`,
                );

                const absoluteItemNumber = chunkStart + index + 1;
                let previewItems = [];

                try {
                    if (result?.imageDataUrl || result?.imageUrl) {
                        const resultUrl = result?.imageDataUrl
                            ? await resolveSlackImageUrl({
                                imageDataUrl: result.imageDataUrl,
                                filenameBase: `${result.id || result.name || "bulk"}-result`,
                                bakeryId: body.bakeryId,
                                environment: body.env,
                                variant: "result",
                            })
                            : "";

                        previewItems = [
                            {
                                label: result.name || result.id || "Generated item",
                                sourceUrl: result.imageUrl || "",
                                resultUrl,
                            },
                        ];
                    }
                } catch (previewError) {
                    console.error(
                        "Could not prepare Slack preview URLs for bulk generation item:",
                        previewError,
                    );
                }

                await notifyGenerationEvent({
                    mode: "bulk",
                    status: result?.error ? "error" : "success",
                    environment: body.env,
                    userName: body.userName,
                    bakeryId: body.bakeryId,
                    bakeryName: body.bakeryName,
                    categoryId: body.categoryId,
                    categoryName: body.categoryName,
                    itemProgress: `${absoluteItemNumber} of ${totalItems}`,
                    itemName: result?.name || result?.id || "",
                    preserveOrientation: body.preserveOrientation !== false ? "yes" : "no",
                    targetOrientation: body.targetOrientation,
                    sourceType: result?.imageUrl ? "image_url" : "image_upload",
                    previewItems,
                    errorMessage: result?.error || "",
                });
            },
        });

        res.write(`${JSON.stringify({ type: "complete", results })}\n`);
        return res.end();
    } catch (error) {
        await notifyGenerationEvent({
            mode: "bulk",
            status: "error",
            environment: body.env,
            userName: body.userName,
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
