import { issuesReport } from "./issuesReport.mjs"
import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { noIssuesToReport } from "../../lib/constants.mjs"
import { reportUnreportables } from "../../lib/reportUnreportables.mjs"
import { renderInteractive } from "../../lib/renderInteractive.mjs"

function milestone(config, _milestone) {
    let title = _milestone.title
    title = _milestone.dueOn ? `${title} (${_milestone.dueOn.substring(0, 10)})` : title
    return renderInteractive(config,
        `<h2><a href="${config.repo}/milestone/${_milestone.number}" target="_blank">${title}</a></h2>\n\n`,
        `<h2>${title}</h2>\n\n`)
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
    ms.issues = getReportableIssues(config, ms, issues) + "\n"
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
        if (i < reportableMilestones.length - 1) formattedOutput += "\n"
        output += formattedOutput
    }
    return output
}
