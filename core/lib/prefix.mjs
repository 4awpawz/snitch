export function prefix(config, lineItemNumber) {
    if (config.prefix === "none") return ""
    if (config.prefix === "numbered" && config.filetype === "md") return "1. "
    if (config.prefix === "numbered" && config.filetype === "txt") return `${lineItemNumber}. `
    if (config.prefix === "bulleted") return "- "
    throw new TypeError("prefix undefined")
}
