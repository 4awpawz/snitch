export function sanitize(config, issues) {
    const unassignedMilestone = "!missing milestone!"
    const unassignedLabels = "!missing labels!"
    const unassignedAssignees = "!missing assignees!"
    for (const issue of issues) {
        if (issue.title.length > 97) issue.title = issue.title.substring(0, 98) + "..."
        if (config.showURL) issue.title = `[${issue.title}](${issue.url})` || `${issue.title}`
        if (issue.milestone === null) issue.milestone = { title: unassignedMilestone }
        if (issue.labels.length === 0) issue.labels.push({ name: unassignedLabels, color: "FF0000" })
        if (issue.assignees.length === 0) issue.assignees.push({ name: unassignedAssignees })
    }
    return issues
}
