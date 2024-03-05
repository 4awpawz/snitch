import { chalkStderr } from "chalk"

export function sanitize(issues) {
    const unassignedMilestone = "!missing milestone!"
    const unassignedLabels = "!missing labels!"
    const unassignedAssignees = "!missing assignees!"
    const sanitizedIssues = []
    let sanitizedCount = 0
    for (const issue of issues) {
        const sanitizedIssue = JSON.parse(JSON.stringify(issue))
        if (sanitizedIssue.milestone === null || sanitizedIssue.labels.length === 0 || sanitizedIssue.assignees.length === 0) {
            if (sanitizedIssue.milestone === null) sanitizedIssue.milestone = { title: unassignedMilestone }
            if (sanitizedIssue.labels.length === 0) sanitizedIssue.labels.push({ name: unassignedLabels, color: "FF0000" })
            if (sanitizedIssue.assignees.length === 0) sanitizedIssue.assignees.push({ name: unassignedAssignees })
            sanitizedCount++
        }
        sanitizedIssues.push(sanitizedIssue)
    }
    if (sanitizedCount) {
        const plrl = sanitizedCount === 1 && "issue" || "issues"
        console.error(chalkStderr.bgYellowBright.blackBright(`Attention: ${sanitizedCount} ${plrl} required sanitizing!`))
    }
    return sanitizedIssues
}
