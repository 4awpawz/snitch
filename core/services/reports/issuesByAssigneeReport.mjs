import { issuesReport } from "./issuesReport.mjs"
import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { noIssuesToReport } from "../../lib/constants.mjs"
import { reportUnreportables } from "../../lib/reportUnreportables.mjs"

function assignee(config, _assignee) {
    return config.fileType === "md" ?
        `<h2><a href="${config.repo}/issues/assigned/${_assignee.login}" target="_blank">${_assignee.name}</a></h2>` :
        _assignee.name
}

/*
 * Compose a reportable milestone with issues.
 */
function getReportableIssues(config, _assignee, issues) {
    const selector = { showState: true, showLabels: true, showAssignees: true, showMilestones: true }
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
    issues.forEach(issue => issue.assignees.forEach(assignee => !assignees.get(assignee.id) && assignees.set(assignee.id, assignee)))
    assignees = [...assignees.values()]
    return assignees.map(assignee => mapReportableAssignee(config, assignee, issues))
}

/*
 * Generate report from reportable label objects.
 */
export function issuesByAssigneeReport(config, issues) {
    reportUnreportables(config, issues, issue => issue.assignees.length === 0)
    const reportableIssues = issues.filter(issue => issue.assignees.length !== 0)
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
