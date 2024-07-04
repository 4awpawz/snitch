import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { showState } from "../../lib/showState.mjs"
import { labelUrl, milestoneUrl, assigneeUrl } from "../../lib/urls.mjs"
import { noIssuesToReport, noMilestone, noLabels, noAssignees } from "../../lib/constants.mjs"
import { formatIssue } from "../../lib/formatIssue.mjs"
import { marked } from "marked"
import { escape } from "../../lib/escape.mjs"
import { renderInteractive } from "../../lib/renderInteractive.mjs"

function assignees(config, assignees) {
    if (assignees.length === 0) return `[ ${noAssignees} ]`
    let asgns = assignees.map(assignee =>
        config.asText ? assignee.name :
            renderInteractive(config,
                `<a href="${assigneeUrl(config, assignee)}" target="_blank" title="link to assignee ${assignee.name}">${assignee.name}</a>`,
                assignee.name)).join(", ")
    return `[ ${asgns} ]`
}

function labels(config, labels) {
    if (!labels.length) return `[ ${noLabels} ]`
    let lbls = labels.map(label =>
        config.asText ? label.name :
            renderInteractive(config,
                `<a href="${labelUrl(config, label)}" target="_blank" title="link to label ${label.name}"><span style="color: #${label.color};">${label.name}</span></a>`,
                `<span style="color: #${label.color};">${label.name}</span>`))
    return `[ ${lbls.join(", ")} ]`
}

function milestone(config, milestone) {
    if (!milestone) return `${noMilestone}`
    let msName = milestone.title
    msName += milestone.dueOn ?
        ` (${milestone.dueOn.substring(0, 10)})` :
        ""
    return config.asText ? msName : renderInteractive(config,
        `<a href="${milestoneUrl(config, milestone)}" target="_blank" title="link to milestone ${milestone.title}">${msName}</a>`,
        msName)
}

function number(number) {
    return `#${number.toString()}:`
}

function title(config, title, url, number) {
    const ttl = config.asText ? title : marked.parseInline(escape(title))
    return config.asText ? ttl : renderInteractive(config, `<a href="${url}" target="_blank" title="link to issue ${number}">${ttl}</a>`, title)
}

function state(config, state) {
    return showState(config, state)
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
    is.title = title(config, issue.title, issue.url, issue.number)
    // labels
    is.labels = labels(config, issue.labels)
    // assignees
    is.assignees = assignees(config, issue.assignees)
    // milestone
    is.milestone = milestone(config, issue.milestone)
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
    if (issues.length === 0) reportAndExit(noIssuesToReport)
    let reportableIssues = getReportableIssues(config, issues)
    if (reportableIssues.length === 0) reportAndExit(noIssuesToReport)
    if (config.sortIssuesAscending) reportableIssues = reportableIssues.reverse()
    let output = "\n\n"
    for (let i = 0; i < reportableIssues.length; i++) {
        const reportableIssue = reportableIssues[i]
        output += formatIssue({
            state: opts.showState ? reportableIssue.state : "",
            number: reportableIssue.number,
            title: reportableIssue.title,
            labels: opts.showLabels ? reportableIssue.labels : "",
            assignees: opts.showAssignees ? reportableIssue.assignees : "",
            milestone: opts.showMilestones ? reportableIssue.milestone : ""
        })
        if (i < reportableIssues.length - 1 && config.blankLines && config.asText) output += "\n\n"
        if (i < reportableIssues.length - 1 && config.blankLines && !config.asText) output += "<br>\n<br>"
        if (i < reportableIssues.length - 1 && !config.blankLines && config.asText) output += "\n"
        if (i < reportableIssues.length - 1 && !config.blankLines && !config.asText) output += "<br>"
    }
    return output
}
