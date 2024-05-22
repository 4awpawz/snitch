
export function showState(config, issueState) {
    if (config.asText && issueState === "CLOSED")
        return "✓"
    if (config.asText && issueState === "OPEN")
        return "x"
    if (!config.asText && issueState === "CLOSED")
        return "<span style=\"display: inline-block; color: green;\">✅</span>"
    if (!config.asText && issueState === "OPEN")
        return "<span style=\"display: inline-block; color: darkgray;\">🆇</span>"
    throw new TypeError(`invalid issue state, found ${issueState}`)
}
