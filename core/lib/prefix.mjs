export function prefix(config, lineItemNumber) {
    if (config.prefix === "none") return ""
    if (config.prefix === "numbered" && config.fileType === "md") return "1. "
    if (config.prefix === "numbered" && config.fileType === "txt") return `${lineItemNumber}. `
    if (config.prefix === "bulleted") return "- "
    throw new TypeError("prefix undefined")
}
