import { issuesReport } from "./issuesReport.mjs"
import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { unassignedMilestone } from "../../lib/unassignedMilestone.mjs"

function milestone(config, _milestone) {
    let mst = config.fileType === "md" ? `## ${_milestone.title}` : _milestone.title
    if (_milestone.dueOn !== null) mst += ` (${_milestone.dueOn.substring(0, 10)})`
    mst += "\n\n"
    return mst
}

/*
 * Compose a reportable milestone with issues.
 */
function getReportableIssues(config, milestone, issues) {
    const selector = { showState: true, showLabels: true, showAssignees: true, showMilestones: false }
    const iss = milestone.number > 0 ?
        issues.filter(issue => issue.milestone !== null && issue.milestone.number === milestone.number) :
        issues.filter(issue => issue.milestone === null)
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
    const ms = issues.reduce((accum, current) => {
        if (!current.milestone && !accum.some(ms => ms.number === 0)) {
            accum.push({ number: 0, title: unassignedMilestone, description: "no description", dueOn: null }) // <- fake milestone
        }
        if (current.milestone && !accum.some(ms => ms.number === current.milestone.number)) {
            accum.push(current.milestone)
        }
        return accum
    }, [])
    return ms.map(milestone => mapReportableMilestone(config, milestone, issues))
}

/*
 * Generate report from reportable milestone objects.
 */
export function issuesByMilestoneReport(config, issues) {
    if (issues.length === 0) reportAndExit("No issues to report")
    const reportableMilestones = getReportableMilestones(config, issues)
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
