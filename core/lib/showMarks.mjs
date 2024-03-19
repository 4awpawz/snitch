//TODO: rename this to showState!
export function showMarks(config, issueState) {
    if (issueState === "CLOSED")
        // return config.fileType === "md" ? "<span style=\"color: green;\">✓ </span>" : "✓ "
        return config.fileType === "md" ? "<span style=\"display: inline-block; color: green; min-width: 2ch\">o </span>" : "o "
    if (issueState === "OPEN")
        // return config.fileType === "md" ? "<span style=\"color: yellow;\">x </span>" : "x "
        return config.fileType === "md" ? "<span style=\"display: inline-block; color: yellow; min-width: 2ch\">x </span>" : "x "
    throw new TypeError(`invalid issue state, found ${issueState}`)
}
