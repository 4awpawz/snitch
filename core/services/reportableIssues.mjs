import { showMarks } from "../lib/showMarks.mjs"

function assignees(assignees) {
    const unassignedAssignees = " No One Assigned"
    let asgns = assignees.length && assignees.map(assignee => assignee.name).join(", ") || `[${unassignedAssignees}] `
    return ` [${asgns}]`
}

function labels(config, labels) {
    const unassignedLabels = "No Labels"
    if (labels === null) return `[${unassignedLabels}] `
    let lbls = config.fileType === "md" ? labels.map(label => `<span style="color: #${label.color};">${label.name}</span>`) :
        labels.map(label => label.name)
    lbls = `[${lbls.join(", ")}]`
    lbls = config.fileType === "md" ? `<span>&nbsp; &nbsp;</span>${lbls}` : `  ${lbls}`
    return `${lbls}`
}

function milestone(milestone) {
    const unassignedMilestone = " No Milestones"
    if (!milestone) return unassignedMilestone
    let ms = ` ${milestone.title}`
    if (milestone.dueOn) ms += ` (${milestone.dueOn.substring(0, 10)})`
    return ms
}

function number(number) {
    return `#${number.toString()}: `
}

function title(config, title, url, number) {
    const ln = Math.abs(number).toString(10).length + 8
    const maxLength = 100 - ln
    let ttl = title.length + ln > maxLength ? title.substring(0, maxLength) + "..." : title
    ttl = config.fileType === "md" && `<a href="${url}" target="_blank">${ttl}</a>` || ttl
    ttl += config.fileType === "md" && "<br>" || "\n"
    return ttl
}

function state(config, state) {
    return showMarks(config, state)
}

function reportableIssue(config, issue) {
    const is = {}
    if (!config) throw new Error("unable to read config")
    if (!issue) throw new Error("unable to read issue")
    // issue state
    is.state = state(config, issue.state)
    // issue number
    is.number = number(issue.number)
    // issue title
    is.title = title(config, issue.title, issue.url, issue.number)
    // labels
    is.labels = labels(config, issue.labels)
    // assignees
    is.assignees = assignees(issue.assignees)
    // milestone
    is.milestone = milestone(issue.milestone)
    return is
}

export function reportableIssues(config, issues) {
    return issues.map((issue) => reportableIssue(config, issue))
}
