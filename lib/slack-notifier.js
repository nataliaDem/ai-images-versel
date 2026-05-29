const fetch = (...args) =>
    import("node-fetch").then(({ default: nodeFetch }) => nodeFetch(...args));

const SLACK_WEBHOOK_URL =
    process.env.SLACK_GENERATION_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL || "";

function truncate(value, maxLength = 300) {
    const normalized = String(value || "").trim();

    if (!normalized) {
        return "";
    }

    if (normalized.length <= maxLength) {
        return normalized;
    }

    return `${normalized.slice(0, maxLength - 1)}…`;
}

function formatSlackValue(value) {
    if (value === undefined || value === null || value === "") {
        return "—";
    }

    return String(value);
}

function buildSlackFields(context = {}) {
    const fields = [
        ["Mode", context.mode],
        ["Status", context.status],
        ["Environment", context.environment],
        ["Bakery ID", context.bakeryId],
        ["Bakery", context.bakeryName],
        ["Category ID", context.categoryId],
        ["Category", context.categoryName],
        ["Items", context.itemCount],
        ["Succeeded", context.successCount],
        ["Failed", context.errorCount],
        ["Orientation", context.targetOrientation],
        ["Preserve orientation", context.preserveOrientation],
        ["Source", context.sourceType],
    ];

    return fields
        .filter(([, value]) => value !== undefined)
        .map(([label, value]) => ({
            type: "mrkdwn",
            text: `*${label}*\n${truncate(formatSlackValue(value), 180)}`,
        }));
}

function buildSummaryLines(pairs = []) {
    return pairs
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([label, value]) => `*${label}:* ${truncate(formatSlackValue(value), 220)}`);
}

function buildGenerationSummary(context = {}) {
    return buildSummaryLines([
        ["Mode", context.mode],
        ["Status", context.status],
        ["Environment", context.environment],
        ["Bakery", context.bakeryName],
        ["Bakery ID", context.bakeryId],
        ["Category", context.categoryName],
        ["Category ID", context.categoryId],
        ["Items", context.itemCount],
        ["Succeeded", context.successCount],
        ["Failed", context.errorCount],
        ["Orientation", context.targetOrientation],
        ["Preserve orientation", context.preserveOrientation],
        ["Source", context.sourceType],
    ]).join("\n");
}

function buildActionSummary(context = {}) {
    return buildSummaryLines([
        ["Operation", context.operation],
        ["Mode", context.mode],
        ["Status", context.status],
        ["Environment", context.environment],
        ["Bakery", context.bakeryName],
        ["Bakery ID", context.bakeryId],
        ["Category", context.categoryName],
        ["Category ID", context.categoryId],
        ["Items", context.itemCount],
        ["Succeeded", context.successCount],
        ["Failed", context.errorCount],
        ["Files", context.fileCount],
        ["Archive", context.archiveName],
        ["Filename", context.filenameBase],
        ["Source", context.sourceType],
    ]).join("\n");
}

async function postToSlack(payload) {
    if (!SLACK_WEBHOOK_URL) {
        return false;
    }

    const response = await fetch(SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Slack webhook request failed with status ${response.status}.`);
    }

    return true;
}

async function notifyGenerationEvent(context = {}) {
    if (!SLACK_WEBHOOK_URL) {
        return false;
    }

    const icon = context.status === "success" ? ":white_check_mark:" : ":x:";
    const headerText =
        context.status === "success"
            ? `${icon} AI image generation succeeded`
            : `${icon} AI image generation failed`;
    const blocks = [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: headerText,
                emoji: true,
            },
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: buildGenerationSummary(context),
            },
        },
    ];

    if (context.errorMessage) {
        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*Error*\n${truncate(context.errorMessage, 1200)}`,
            },
        });
    }

    if (Array.isArray(context.failedItems) && context.failedItems.length > 0) {
        const failedItemsText = context.failedItems
            .slice(0, 10)
            .map((item) => `• ${truncate(item.name || item.id || "Unknown item", 80)}: ${truncate(item.error, 140)}`)
            .join("\n");

        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*Failed items*\n${failedItemsText}`,
            },
        });
    }

    try {
        return await postToSlack({
            text: headerText,
            blocks,
        });
    } catch (error) {
        console.error("Slack notification failed:", error);
        return false;
    }
}

async function notifyActionEvent(context = {}) {
    if (!SLACK_WEBHOOK_URL) {
        return false;
    }

    const status = context.status || "success";
    const operation = context.operation || "action";
    const icon = status === "success" ? ":white_check_mark:" : ":x:";
    const operationLabel = operation.charAt(0).toUpperCase() + operation.slice(1);
    const headerText =
        status === "success"
            ? `${icon} AI image ${operationLabel.toLowerCase()} succeeded`
            : `${icon} AI image ${operationLabel.toLowerCase()} failed`;
    const blocks = [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: headerText,
                emoji: true,
            },
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: buildActionSummary({
                    ...context,
                    operation: operationLabel,
                }),
            },
        },
    ];

    if (context.errorMessage) {
        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*Error*\n${truncate(context.errorMessage, 1200)}`,
            },
        });
    }

    try {
        return await postToSlack({
            text: headerText,
            blocks,
        });
    } catch (error) {
        console.error("Slack notification failed:", error);
        return false;
    }
}

module.exports = {
    notifyActionEvent,
    notifyGenerationEvent,
};
