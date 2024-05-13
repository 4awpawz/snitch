import { issuesReport } from "./issuesReport.mjs"
import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { noIssuesToReport } from "../../lib/constants.mjs"
import { reportUnreportables } from "../../lib/reportUnreportables.mjs"
import { renderInteractive } from "../../lib/renderInteractive.mjs"

function assignee(config, _assignee) {
    return renderInteractive(config,
        `<h2><a href="${config.repo}/issues/assigned/${_assignee.login}" target="_blank">${_assignee.name}</a></h2>`,
        `<h2>${_assignee.name}</h2>`
    )
}

/*
 * Compose a reportable milestone with issues.
 */
function getReportableIssues(config, _assignee, issues) {
    const selector = { showState: true, showLabels: true, showAssignees: false, showMilestones: true }
    const matches = issues.filter(issue => issue.assignees.some(assignee => assignee.id === _assignee.id))
    const lss = issuesReport(config, matches, selector)
    return lss
}

/*
 * Compose a reportable milestone object from milestone properties.
 */
function mapReportableAssignee(config, assignee, issues) {
    const asgn = {}
    asgn.id = assignee.id
    asgn.login = assignee.login
    asgn.name = assignee.name
    asgn.issues = getReportableIssues(config, asgn, issues) + "\n"
    return asgn
}

/*
 * Compose report from reportable milestone objects.
 */
function getReportableAssignees(config, issues) {
    let assignees = new Map()
    issues.forEach(issue => issue.assignees.forEach(assignee => assignee.name !== "" && !assignees.get(assignee.id) && assignees.set(assignee.id, assignee)))
    assignees = [...assignees.values()].sort((a, b) => {
        if (a.name.toUpperCase() > b.name.toUpperCase()) return 1
        if (a.name.toUpperCase() < b.name.toUpperCase()) return -1
        return 0
    })
    return assignees.map(assignee => mapReportableAssignee(config, assignee, issues))
}

/*
 * Generate report from reportable label objects.
 */
export function issuesByAssigneeReport(config, issues) {
    // Ignore those issues which have no assignees or those issues whose assignees are all unnamed.
    reportUnreportables(config, issues, issue => issue.assignees.length === 0 ||
        issue.assignees.length === issue.assignees.filter(assignee => assignee.name === "").length)
    // Report only issues that have at least one named assignee.
    const reportableIssues = issues.filter(issue => issue.assignees.length !== 0 && issue.assignees.some(assignee => assignee.name !== ""))
    if (reportableIssues.length === 0) reportAndExit(noIssuesToReport)
    const reportableAssignees = getReportableAssignees(config, reportableIssues)
    if (reportableAssignees.length === 0) reportAndExit(noIssuesToReport)
    let output = ""
    for (let i = 0; i < reportableAssignees.length; i++) {
        const reportableAssignee = reportableAssignees[i]
        let formattedOutput = ""
        formattedOutput += assignee(config, reportableAssignee) + "\n\n"
        formattedOutput += reportableAssignee.issues
        if (i < reportableAssignees.length - 1) formattedOutput += "\n"
        output += formattedOutput
    }
    return output
}
