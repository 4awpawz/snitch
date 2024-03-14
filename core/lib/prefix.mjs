export function prefix(config, lineItemNumber) {
    if (config.prefix === "none") return { show: "", length: 0 }
    if (config.prefix === "numbered" && config.fileType === "md") return { show: "1. ", length: lineItemNumber.length + 1 }
    if (config.prefix === "numbered" && config.fileType === "txt") return { show: `${lineItemNumber} `, length: lineItemNumber.length + 1 }
    if (config.prefix === "bulleted") return { show: "- ", length: 2 }
    throw new TypeError("prefix undefined")
}
