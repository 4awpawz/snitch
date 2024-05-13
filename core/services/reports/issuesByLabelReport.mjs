import { issuesReport } from "./issuesReport.mjs"
import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { labelUrl } from "../../lib/urls.mjs"
import { noIssuesToReport } from "../../lib/constants.mjs"
import { renderInteractive } from "../../lib/renderInteractive.mjs"

function label(config, label) {
    return renderInteractive(config,
        `<h2 style="color: #${label.color};"><a style="color: inherit;" href="${labelUrl(config, label)}" target="_blank">${label.name}</a></h2>`,
        `<h2 style="color: #${label.color};">${label.name}</h2>`
    )
}

/*
 * Compose a reportable milestone with issues.
 */
function getReportableIssues(config, label, issues) {
    const selector = { showState: true, showLabels: false, showAssignees: true, showMilestones: true }
    const matches = issues.filter(issue => issue.labels.some(lbl => lbl.name === label.name))
    const lss = issuesReport(config, matches, selector)
    return lss
}

/*
 * Compose a reportable milestone object from milestone properties.
 */
function mapReportableLabel(config, label, issues) {
    const lbl = {}
    lbl.name = label.name
    lbl.color = label.color
    lbl.issues = getReportableIssues(config, label, issues)
    return lbl
}

/*
 * Compose report from reportable milestone objects.
 */
function getReportableLabels(config, issues) {
    let labels = new Map()
    issues.forEach(issue => issue.labels.forEach(label => !labels.get(label.id) && labels.set(label.id, label)))
    labels = [...labels.values()]
    labels = labels.sort((a, b) => {
        const nameA = a.name.toUpperCase()
        const nameB = b.name.toUpperCase()
        if (nameA > nameB) return 1
        if (nameA < nameB) return -1
        return 0
    })
    return labels.map(label => mapReportableLabel(config, label, issues))
}

/*
 * Generate report from reportable label objects.
 */
export function issuesByLabelReport(config, issues) {
    if (issues.length === 0) reportAndExit(noIssuesToReport)
    const reportableLabels = getReportableLabels(config, issues)
    if (reportableLabels.length === 0) reportAndExit(noIssuesToReport)
    let output = ""
    for (let i = 0; i < reportableLabels.length; i++) {
        const reportableLabel = reportableLabels[i]
        let formattedOutput = ""
        formattedOutput += label(config, reportableLabel) + "\n\n"
        formattedOutput += reportableLabel.issues
        if (i < reportableLabels.length - 1) formattedOutput += "\n"
        output += formattedOutput
    }
    return output
}
