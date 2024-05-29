import { issuesReport } from "./issuesReport.mjs"
import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { noIssuesToReport } from "../../lib/constants.mjs"
import { reportUnreportables } from "../../lib/reportUnreportables.mjs"
import { renderInteractive } from "../../lib/renderInteractive.mjs"
import { milestoneUrl } from "../../lib/urls.mjs"

function milestone(config, _milestone) {
    let title = _milestone.title
    title = _milestone.dueOn ? `${title} (${_milestone.dueOn.substring(0, 10)})` : title
    return config.asText ? `\n\n${title}` :
        renderInteractive(config,
            `<h2><a href="${milestoneUrl(config, _milestone)}" target="_blank" title="link to milestone ${_milestone.title}">${title}</a></h2>`,
            `<h2>${title}</h2>`)
}

/*
 * Compose a reportable milestone with issues.
 */
function getReportableIssues(config, milestone, issues) {
    const selector = { showState: true, showLabels: true, showAssignees: true, showMilestones: false }
    const iss = issues.filter(issue => issue.milestone?.number === milestone.number)
    const lss = issuesReport(config, iss, selector)
    return lss
}

/*
 * Compose a reportable milestone object from milestone properties.
 */
function mapReportableMilestone(config, _milestone, issues) {
    const ms = {}
    ms.title = milestone(config, _milestone)
    ms.number = _milestone.number
    ms.dueOn = Object.hasOwn(_milestone, "dueOn") && _milestone.dueOn || null
    ms.issues = getReportableIssues(config, ms, issues)
    return ms
}

/*
 * Compose report from reportable milestone objects.
 */
function getReportableMilestones(config, issues) {
    let ms = new Map()
    issues.forEach(issue => !ms.has(issue.milestone.number) && ms.set(issue.milestone.number, issue.milestone))
    ms = [...ms.values()].sort((a, b) => {
        if (a.title.toUpperCase() > b.title.toUpperCase()) return 1
        if (a.title.toUpperCase() < b.title.toUpperCase()) return -1
        return 0
    })
    return ms.map(milestone => mapReportableMilestone(config, milestone, issues))
}

/*
 * Generate report from reportable milestone objects.
 */
export function issuesByMilestoneReport(config, issues) {
    if (issues.length === 0) reportAndExit(noIssuesToReport)
    reportUnreportables(config, issues, issue => issue.milestone === null)
    const reportableIssues = issues.filter(issue => issue.milestone !== null)
    if (reportableIssues.length === 0) reportAndExit(noIssuesToReport)
    const reportableMilestones = getReportableMilestones(config, reportableIssues)
    if (reportableMilestones.length === 0) reportAndExit(noIssuesToReport)
    let output = ""
    for (let i = 0; i < reportableMilestones.length; i++) {
        const reportableMilestone = reportableMilestones[i]
        let formattedOutput = ""
        formattedOutput += reportableMilestone.title
        formattedOutput += reportableMilestone.issues
        // formattedOutput += !config.blankLines && config.asText && "\n" || ""
        output += formattedOutput
    }
    return output
}
