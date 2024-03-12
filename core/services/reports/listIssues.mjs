import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { showMarks } from "../../lib/showMarks.mjs"
import { prefix } from "../../lib/prefix.mjs"

export function listIssues(config, issues) {
    if (issues.length === 0) reportAndExit("No issues to report")
    let output = ""
    output += "\n"
    for (let i = 0; i < issues.length; i++) {
        const issue = issues[i]
        let labels = (config.fileType === "md" && config.showColor) ?
            issue.labels.map(label => `<span style="color: #${label.color};">${label.name}</span>`) : issue.labels.map(label => label.name)
        output += prefix(config, i + 1)
        output += config.showState && config.showMarks && `${showMarks(config, issue.state)}` || `${issue.state} `
        output += `#${issue.number}: `
        output += issue.title
        output += config.breakAfterTitle && (config.fileType === "md" && "<br>" || "\n") || " "
        output += `[${labels.join(", ")}]`
        if (config.showAssignees) output += ` [${issue.assignees.map(assignee => assignee.name).join(", ")}]`
        if (issue.milestone?.title) output += ` ${issue.milestone.title}`
        if (issue.milestone?.dueOn) output += ` (${issue.milestone.dueOn.substring(0, 10)})`
        output += "\n"
        if (config.fileType === "md" && i !== issues.length - 1 && config.report === "list-md") output += "\n"
        if (config.blankLine) output += "\n"
    }
    return output
}
