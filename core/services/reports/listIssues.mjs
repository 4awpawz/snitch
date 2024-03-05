import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { prefix } from "../../lib/prefix.mjs"

export function listIssues(config, issues) {
    if (issues.length === 0) reportAndExit("No issues to report")
    let output = ""
    let lineItemNumber = 1
    output += "\n"
    for (let i = 0; i < issues.length; i++) {
        const issue = issues[i]
        let labels = config.filetype === "md" && config.colorizedlabels ?
            issue.labels.map(label => `<span style="color: #${label.color};">${label.name}</span>`) : issue.labels.map(label => label.name)
        output += prefix(config, lineItemNumber)
        lineItemNumber++
        output += `#${issue.number}: ${issue.title} [${labels.join(", ")}]`
        if (issue.milestone?.title) output += ` ${issue.milestone.title}`
        if (issue.milestone?.dueOn) output += ` (${issue.milestone.dueOn.substring(0, 10)})`
        output += "\n"
        if (config.filetype === "md" && i !== issues.length - 1 && config.report === "list-md") output += "\n"
        if (config.blankline) output += "\n"
            || config.report === "milestone-label-list-md"
        if (config.blankline) output += "\n"
    }
    return output
}