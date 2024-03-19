import { issuesReport } from "./issuesReport.mjs"
import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { unassignedMilestone } from "../../lib/unassignedMilestone.mjs"

function milestone(config, _milestone) {
    let mst = config.fileType === "md" ? `## ${_milestone.title}` : _milestone.title
    if (_milestone.dueOn !== null) mst += ` (${_milestone.dueOn.substring(0, 10)})`
    mst += "\n\n"
    return mst
}

function label(config, _label) {
    let lbl = config.fileType === "md" ? `### <span style="color: #${_label.color};">${_label.name}</span>` : _label.name
    return `${lbl}\n\n`
}

/*
 * Compose a reportable milestone with issues.
 */
function getReportableIssues(config, milestoneLabelIssues) {
    const selector = { showState: true, showLabels: false, showAssignees: true, showMilestones: false }
    const lss = issuesReport(config, milestoneLabelIssues, selector)
    return lss
}

/*
 * Compose a reportable milestone with labels and their matching issues.
 */
function getReportableLabels(config, milestone, issues) {
    const milestoneIssues = issues.filter(issue =>
        issue.milestone !== null && issue.milestone.number === milestone.number ||
        issue.milestone === null && milestone.number === 0)
    let milestoneLabels = new Map()
    for (const issue of milestoneIssues) {
        if (issue.labels.lengh !== 0) {
            for (const label of issue.labels) {
                if (!milestoneLabels.has(label.id)) milestoneLabels.set(label.id, label)
            }
        }
    }
    milestoneLabels = [...milestoneLabels.values()].sort((a, b) => {
        const nameA = a.name.toUpperCase()
        const nameB = b.name.toUpperCase()
        // Descending order
        if (nameA > nameB) return 1
        if (nameA < nameB) return -1
        return 0
    })
    let milestoneLabelIssues
    for (const milestoneLabel of milestoneLabels) {
        milestoneLabelIssues = []
        for (const milestoneIssue of milestoneIssues) {
            for (const label of milestoneIssue.labels) {
                if (label.id === milestoneLabel.id) milestoneLabelIssues.push(milestoneIssue)
            }
            milestoneLabel.issues = milestoneLabelIssues
        }
    }
    for (const milestoneLabel of milestoneLabels) {
        milestoneLabel.issues = getReportableIssues(config, milestoneLabel.issues)
    }
    return milestoneLabels
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
export function issuesByMilestoneAndLabelReport(config, issues) {
    if (issues.length === 0) reportAndExit("No issues to report")
    const reportableMilestones = getReportableMilestones(config, issues)
    let output = ""
    for (let i = 0; i < reportableMilestones.length; i++) {
        const reportableMilestone = reportableMilestones[i]
        let formattedOutput = ""
        formattedOutput += reportableMilestone.title
        for (let ii = 0; ii < reportableMilestone.labels.length; ii++) {
            const reportableMilestoneLabel = reportableMilestone.labels[ii]
            formattedOutput += label(config, reportableMilestoneLabel)
            formattedOutput += reportableMilestoneLabel.issues
            if (ii < reportableMilestone.labels.length - 1) formattedOutput += "\n\n"
        }
        if (i < reportableMilestones.length - 1) formattedOutput += "\n\n"
        output += formattedOutput
    }
    return output
}
