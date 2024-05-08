import { escape } from "../../lib/escape.mjs"
import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { showMarks } from "../../lib/showMarks.mjs"
import { wrap } from "../../lib/wrap.mjs"
import { txtIndent, mdIndent } from "../../lib/indent.mjs"
import { labelUrl, milestoneUrl, assigneeUrl } from "../../lib/urls.mjs"
import { noIssuesToReport, noMilestone, noLabels, noAssignees } from "../../lib/constants.mjs"

function assignees(config, assignees) {
    if (assignees.length === 0) return `[ ${noAssignees} ]`
    let asgns = assignees.map(assignee => assigneeUrl(config, assignee)).join(", ")
    return `[ ${asgns} ]`
}

function labels(config, labels) {
    if (!labels.length) return `${mdIndent}[ ${noLabels} ] `
    let lbls = labels.map(label => `<a href="${labelUrl(config, label)}" target="_blank"><span style="color: #${label.color};">${label.name}</span></a>`)
    lbls = `[ ${lbls.join(", ")} ]`
    lbls = mdIndent + lbls
    return `${lbls} `
}

function milestone(config, milestone) {
    if (!milestone) return ` ${noMilestone}`
    let msName = milestone.title
    msName += milestone.dueOn ?
        ` (${milestone.dueOn.substring(0, 10)})` :
        ""
    return ` <a href="${milestoneUrl(config, milestone)}" target="_blank">${msName}</a>`
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
        // NOTE: that some markdown engines replace 3 dot characters (i.e., ...) with a single character,
        // an ellipsis, which is why for markdown we reduce the length only by 1 and not by 3. If this
        // becomes an issue for some users due to their rendering engines response to 3 dots then this
        // should be backed by a configuration option.
        const croppingLength = remainingLength - title.length - 1
        ttl = title.slice(0, croppingLength)
        ttl += "&hellip;"
    }
    if (config.wrap && remainingLength < title.length) {
        ttl = wrap(config, title, remainingLength)
    }
    if (remainingLength >= title.length) ttl = escape(title)
    ttl = `<a href="${url}" target="_blank" title="link to issue ${number}">${ttl}</a><br>`
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
    const reportableIssues = getReportableIssues(config, issues)
    if (reportableIssues.length === 0) reportAndExit(noIssuesToReport)
    let output = ""
    for (let i = 0; i < reportableIssues.length; i++) {
        const reportableIssue = reportableIssues[i]
        let formattedOutput = ""
        formattedOutput += opts.showState ? reportableIssue.state : ""
        formattedOutput += reportableIssue.number
        formattedOutput += reportableIssue.title
        formattedOutput += opts.showLabels ? reportableIssue.labels : mdIndent
        reportableIssue.assignees = opts.showLabels ? reportableIssue.assignees : reportableIssue.assignees.trim()
        formattedOutput += opts.showAssignees ? reportableIssue.assignees : ""
        formattedOutput += opts.showMilestones ? reportableIssue.milestone : ""
        if (i < reportableIssues.length - 1) formattedOutput += "\n\n"
        output += formattedOutput
    }
    return output
}
