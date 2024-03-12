import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { showMarks } from "../../lib/showMarks.mjs"
import { prefix } from "../../lib/prefix.mjs"

export function groupIssuesByMilestoneAndLabel(config, issues) {
    if (issues.length === 0) reportAndExit("No issues to report")
    const milestones = issues.reduce((accum, currentvalue) => {
        const hasMilestone = accum.some(milestone => milestone.title === currentvalue.milestone.title)
        !hasMilestone && accum.push({ title: currentvalue.milestone.title, dueOn: currentvalue.milestone.dueOn })
        return accum
    }, [])
    let output = ""
    for (const milestone of milestones) {
        output += "\n"
        output += (config.fileType === "md" ? `## ${milestone.title}` : `${milestone.title}`)
        if (milestone.dueOn) output += ` (${milestone.dueOn.substring(0, 10)})`
        output += "\n"
        const issuesByMilestone = issues.filter(issue => issue.milestone.title === milestone.title)
        let labelsByMilestone = issuesByMilestone.reduce((accum, currentValue) => {
            currentValue.labels.forEach(label => !accum.some(a => a.name === label.name) && accum.push(label))
            return accum
        }, [])
        labelsByMilestone.sort((a, b) => {
            if (a.name > b.name) return 1
            if (a.name < b.name) return -1
            return 0
        })
        for (const label of labelsByMilestone) {
            output += "\n"
            const issuesByLabel = issuesByMilestone.reduce((accum, currentValue) => {
                currentValue.labels.forEach(lbl => lbl.name === label.name && accum.push(currentValue))
                return accum
            }, [])
            output += (config.fileType === "md" && config.showColor ?
                `### ${`<span style="color: #${label.color};">${label.name}</span>`}` :
                `${label.name}`) + ` (${issuesByLabel.length})` + "\n\n"
            for (let i = 0; i < issuesByLabel.length; i++) {
                const issue = issuesByLabel[i]
                output += prefix(config, i + 1)
                // let state = (config.fileType === "md" && config.showState && issue.state === "OPEN" && "OPEN") ||
                //     (config.fileType === "txt" && config.showState && issue.state === "OPEN" && "OPEN ") ||
                //     `${issue.state}`
                output += config.showState && config.showMarks && `${showMarks(config, issue.state)}` || `${issue.state} `
                // if (config.showState && !config.showMarks) output += ` ${issue.state}`
                output += `#${issue.number}: `
                output += issue.title
                output += config.breakAfterTitle && (config.fileType === "md" && "<br>" || "\n") || " "
                if (config.showAssignees) output += `[${issue.assignees.map(assignee => assignee.name).join(", ")}]`
                output += "\n"
                if (config.fileType === "md" && config.report.includes("list") && i !== issuesByLabel.length - 1) output += "\n"
                if (config.blankLine) output += "\n"
            }
        }
    }
    return output
}
