import escapeHtml from "escape-html"
import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { showMarks } from "../../lib/showMarks.mjs"
import { wrap } from "../../lib/wrap.mjs"
import { txtIndent, mdIndent } from "../../lib/indent.mjs"

function assignees(assignees) {
    const unassignedAssignees = "No One Assigned"
    let asgns = assignees.length && assignees.map(assignee => assignee.name).join(", ") || `${unassignedAssignees}`
    return ` [ ${asgns} ]`
}

function labels(config, labels) {
    const unassignedLabels = "No Labels"
    if (!labels.length) return config.fileType === "md" ? `&nbsp; &nbsp;[ ${unassignedLabels} ] ` : `  [ ${unassignedLabels}] `
    let lbls = config.fileType === "md" ? labels.map(label => `<span style="color: #${label.color};">${label.name}</span>`) :
        labels.map(label => label.name)
    lbls = `[ ${lbls.join(", ")} ]`
    lbls = config.fileType === "md" ? mdIndent + lbls : txtIndent + lbls
    return `${lbls}`
}

function milestone(milestone) {
    const unassignedMilestone = " No Milestone"
    if (!milestone) return unassignedMilestone
    let ms = ` ${milestone.title}`
    if (milestone.dueOn) ms += ` (${milestone.dueOn.substring(0, 10)})`
    return ms
}

function number(number) {
    return `#${number.toString()}: `
}

function title(config, title, url, number) {
    let ttl = ""
    const offset = 5 // includes check or x + space + #: + space
    const numberLength = Math.abs(number).toString(10).length
    const totalLength = numberLength + offset
    const remainingLength = config.maxLength - totalLength
    if (config.crop && remainingLength < title.length) {
        const croppingLength = config.fileType === "md" ?
            // NOTE: that some markdown engines replace 3 dot characters (i.e., ...) with a single character,
            // an ellipsis, which is why for markdown we reduce the length only by 1 and not by 3. If this
            // becomes an issue for some users due to their rendering engines response to 3 dots then this
            // should be backed by a configuration option.
            remainingLength - title.length - 1 : remainingLength - 3 - title.length
        ttl = title.slice(0, croppingLength)
        ttl += config.fileType === "md" ? "&hellip;" : "..."
    }
    if (config.wrap && remainingLength < title.length) {
        ttl = wrap(config, title, remainingLength)
    }
    if (remainingLength >= title.length) ttl = title
    ttl = config.fileType === "md" &&
        `<a href="${url}" target="_blank" title="link to issue ${number}">${ttl}</a>` || ttl
    ttl += config.fileType === "md" ? "<br>" : "\n"
    return ttl
}

function state(config, state) {
    return showMarks(config, state)
}

/*
 * Compose a reportable issue object from issue properties.
 */
function mapReportableIssue(config, issue) {
    const is = {}
    // issue state
    is.state = state(config, issue.state)
    // issue number
    is.number = number(issue.number)
    // issue title
    issue.title = config.fileType === "md" ? escapeHtml(issue.title) : issue.title
    is.title = title(config, issue.title, issue.url, issue.number)
    // labels
    is.labels = labels(config, issue.labels)
    // assignees
    is.assignees = assignees(issue.assignees)
    // milestone
    is.milestone = milestone(issue.milestone)
    return is
}

/*
 * Compose report from reportable issue objects.
 */
function getReportableIssues(config, issues) {
    return issues.map(issue => mapReportableIssue(config, issue))
}

/*
 * Generate report from reportable issue objects.
 */
export function issuesReport(config, issues, opts = { showState: true, showLabels: true, showAssignees: true, showMilestones: true }) {
    if (issues.length === 0) reportAndExit("No issues to report")
    const reportableIssues = getReportableIssues(config, issues)
    let output = ""
    for (let i = 0; i < reportableIssues.length; i++) {
        const reportableIssue = reportableIssues[i]
        let formattedOutput = ""
        formattedOutput += opts.showState ? reportableIssue.state : ""
        formattedOutput += reportableIssue.number
        formattedOutput += reportableIssue.title
        formattedOutput += opts.showLabels ? reportableIssue.labels : config.fileType === "md" ? mdIndent : txtIndent
        reportableIssue.assignees = opts.showLabels ? reportableIssue.assignees : reportableIssue.assignees.trim()
        formattedOutput += opts.showAssignees ? reportableIssue.assignees : ""
        formattedOutput += opts.showMilestones ? reportableIssue.milestone : ""
        if (i < reportableIssues.length - 1) formattedOutput += "\n\n"
        output += formattedOutput
    }
    return output
}
