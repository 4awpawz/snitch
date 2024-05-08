//TODO: rename this to showState!
export function showMarks(config, issueState) {
    if (issueState === "CLOSED")
        return "<span style=\"display: inline-block; color: green; min-width: 2ch\">x </span>"
    if (issueState === "OPEN")
        return "<span style=\"display: inline-block; color: yellow; min-width: 2ch\">o </span>"
    throw new TypeError(`invalid issue state, found ${issueState}`)
}
