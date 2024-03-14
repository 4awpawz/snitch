//TODO: rename this to showState!
export function showMarks(config, issueState) {
    if (issueState === "CLOSED")
        return config.fileType === "md" && config.showColor ? { show: "<span style=\"color: green;\">✓ </span>", length: 2 } : { show: "✓ ", length: 2 }
    if (issueState === "OPEN")
        return config.fileType === "md" && config.showColor ? { show: "<span style=\"color: yellow;\">x </span>", length: 2 } : { show: "o ", length: 2 }
    throw new TypeError(`invalid issue state, found ${issueState}`)
}
