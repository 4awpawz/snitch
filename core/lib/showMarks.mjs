//TODO: rename this to showState!
export function showMarks(config, issueState) {
    if (issueState === "CLOSED")
        return config.fileType === "md" ? "<span style=\"display: inline-block; color: green; min-width: 2ch\">x </span>" : "x "
    if (issueState === "OPEN")
        return config.fileType === "md" ? "<span style=\"display: inline-block; color: yellow; min-width: 2ch\">o </span>" : "o "
    throw new TypeError(`invalid issue state, found ${issueState}`)
}
