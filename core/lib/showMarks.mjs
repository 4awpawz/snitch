export function showMarks(config, issueState) {
    if (issueState === "CLOSED")
        return config.fileType === "md" ? "<span style=\"color: green;\">✓ </span>" : "✓ "
    if (issueState === "OPEN")
        return config.fileType === "md" ? "<span style=\"color: yellow;\">x </span>" : "x "
    throw new TypeError(`invalid issue state, found ${issueState}`)
}
