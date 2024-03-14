export function sanitize(config, issues) {
    const unassignedMilestone = "No Milestones"
    const unassignedLabels = "No Labels"
    const unassignedAssignees = "No One Assigned"
    for (const issue of issues) {
        if (issue.milestone === null) issue.milestone = { title: unassignedMilestone }
        if (issue.labels.length === 0) issue.labels.push({ name: unassignedLabels, color: "FF0000" })
        if (issue.assignees.length === 0) issue.assignees.push({ name: unassignedAssignees })
    }
    return issues
}
