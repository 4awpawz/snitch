import { issuesReport } from "./issuesReport.mjs"
import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { noIssuesToReport } from "../../lib/constants.mjs"
import { labelUrl, milestoneUrl } from "../../lib/urls.mjs"
import { reportUnreportables } from "../../lib/reportUnreportables.mjs"
import { renderInteractive } from "../../lib/renderInteractive.mjs"

function milestone(config, _milestone) {
    let title = _milestone.title
    title = _milestone.dueOn ? `${title} (${_milestone.dueOn.substring(0, 10)})` : title
    return renderInteractive(config,
        `<h2><a href="${milestoneUrl(config, _milestone)}" target="_blank" title="link to milestone ${_milestone.title}">${title}</a></h2>\n\n`,
        `<h2>${title}</h2>\n\n`)
}

function label(config, label) {
    return renderInteractive(config,
        `<h3 style="color: #${label.color};"><a style="color: inherit;" href="${labelUrl(config, label)}" target="_blank" title="link to label ${label.name}">${label.name}</a></h3>\n\n`,
        `<h3 style="color: #${label.color};">${label.name}</h3>\n\n`
    )
}

/*
 * Compose a reportable milestone's labels with issues.
 */
function getReportableIssues(config, milestone, label, issues) {
    const selector = { showState: true, showLabels: false, showAssignees: true, showMilestones: false }
    const milestoneLabelIssues = []
    issues.forEach(issue => issue.milestone && issue.milestone.number === milestone.number && issue.labels.some(issueLabel => issueLabel.id === label.id && milestoneLabelIssues.push(issue)))
    const lss = issuesReport(config, milestoneLabelIssues, selector)
    return lss
}

/*
 * Compose a reportable milestone with labels and their matching issues.
 */
function getReportableLabels(config, milestone, issues) {
    let labels = new Map()
    issues.forEach(issue => issue.milestone.number === milestone.number &&
        issue.labels.forEach(label => !labels.get(label.id) && labels.set(label.id, label)))
    labels = [...labels.values()].sort((a, b) => {
        if (a.name.toUpperCase() > b.name.toUpperCase()) return 1
        if (a.name.toUpperCase() < b.name.toUpperCase()) return -1
        return 0
    })
    labels.forEach(label => label.issues = getReportableIssues(config, milestone, label, issues))
    return labels
}

/*
 * Compose a reportable milestone object from milestone properties.
 */
function mapReportableMilestone(config, _milestone, issues) {
    const ms = {}
    ms.title = milestone(config, _milestone)
    ms.number = _milestone.number
    ms.dueOn = Object.hasOwn(_milestone, "dueOn") && _milestone.dueOn || null
    ms.labels = getReportableLabels(config, ms, issues)
    return ms
}

/*
 * Compose report from reportable milestone objects.
 */
function getReportableMilestones(config, issues) {
    let ms = new Map()
    issues.forEach(issue => !ms.has(issue.milestone.number) && ms.set(issue.milestone.number, issue.milestone))
    ms = [...ms.values()]
    return ms.map(milestone => mapReportableMilestone(config, milestone, issues))
}

/*
 * Generate report from reportable milestone objects.
 */
export function issuesByMilestoneAndLabelReport(config, issues) {
    reportUnreportables(config, issues, issue => issue.milestone === null || issue.labels.length === 0)
    const reportableIssues = issues.filter(issue => issue.milestone !== null && issue.labels.length > 0)
    if (reportableIssues.length === 0) reportAndExit(noIssuesToReport)
    const reportableMilestones = getReportableMilestones(config, reportableIssues)
    // if (reportableMilestones.length === 0) reportAndExit(noIssuesToReport)
    let output = ""
    for (let i = 0; i < reportableMilestones.length; i++) {
        const reportableMilestone = reportableMilestones[i]
        let formattedOutput = ""
        formattedOutput += reportableMilestone.title
        for (let ii = 0; ii < reportableMilestone.labels.length; ii++) {
            const reportableMilestoneLabel = reportableMilestone.labels[ii]
            formattedOutput += label(config, reportableMilestoneLabel)
            formattedOutput += reportableMilestoneLabel.issues
            if (ii < reportableMilestone.labels.length - 1) formattedOutput += "\n"
        }
        if (i < reportableMilestones.length - 1) formattedOutput += "\n"
        output += formattedOutput
    }
    return output
}
