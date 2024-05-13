export function showState(issueState) {
    if (issueState === "CLOSED")
        return "<span style=\"display: inline-block; color: green;\">✅</span>"
    if (issueState === "OPEN")

        return "<span style=\"display: inline-block; color: darkgray;\">🆇</span>"
    throw new TypeError(`invalid issue state, found ${issueState}`)
}
