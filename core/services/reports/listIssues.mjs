import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { showMarks } from "../../lib/showMarks.mjs"
import { prefix } from "../../lib/prefix.mjs"

export function listIssues(config, issues) {
    if (issues.length === 0) reportAndExit("No issues to report")
    let output = ""
    output += "\n"
    for (let i = 0; i < issues.length; i++) {
        const issue = issues[i]
        let formattedOutput = ""
        let prf = prefix(config, i + 1)
        formattedOutput += prf.show
        let ln = prf.length
        let mark = config.showState && config.showMarks && showMarks(config, issue.state)
        formattedOutput += config.showState && (config.showMarks && mark.show || `${issue.state} `) || ""
        ln += mark?.length || issue.state.length + 1
        formattedOutput += `#${issue.number}: `
        ln += issue.number.toString().length + 2
        let title = config.noWrap && issue.title.length > (100 - ln) ? issue.title.substring(0, 100 - ln - 3) + "..." : issue.title;
        if (config.showURL) title = `<a href="${issue.url}" target="_blank">${title}</a>` || `${title}`
        formattedOutput += title
        formattedOutput += config.breakAfterTitle && (config.fileType === "md" && "<br>" || "\n") || " "
        let labels = (config.fileType === "md" && config.showColor) ?
            issue.labels.map(label => `<span style="color: #${label.color};">${label.name}</span>`).join(", ") :
            issue.labels.map(label => label.name).join(", ")
        labels = `<span>${"&nbsp; ".repeat(ln)}</span>${labels}`
        formattedOutput += labels
        if (config.showAssignees) formattedOutput += ` [${issue.assignees.map(assignee => assignee.name).join(", ")}]`
        if (issue.milestone?.title) formattedOutput += ` ${issue.milestone.title}`
        if (issue.milestone?.dueOn) formattedOutput += ` (${issue.milestone.dueOn.substring(0, 10)})`
        formattedOutput += "\n"
        if (config.fileType === "md" && i !== issues.length - 1 && config.report === "list-md") formattedOutput += "\n"
        if (config.fileType === "txt" && config.blankLine && i !== issues.length - 1) formattedOutput += "\n"
        output += formattedOutput
    }
    return output
}
