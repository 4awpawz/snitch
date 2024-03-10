import { reportAndExit } from "../../lib/reportAndExit.mjs"
import { showMarks } from "../../lib/showMarks.mjs"
import { prefix } from "../../lib/prefix.mjs"

export function groupIssuesByMilestone(config, issues) {
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
        output += "\n\n"
        const issuesByMilestone = issues.filter(issue => issue.milestone.title === milestone.title)
        for (let i = 0; i < issuesByMilestone.length; i++) {
            const issue = issuesByMilestone[i]
            let labels = issue.labels.sort((a, b) => {
                if (a.name > b.name) return 1
                if (a.name < b.name) return -1
                return 0
            })
            labels = config.fileType === "md" && config.colorizedLabels ?
                labels.map(label => `<span style="color: #${label.color};">${label.name}</span>`) :
                labels.map(label => label.name)
            output += prefix(config, i + 1)
            if (config.showState && config.showMarks) output += `${showMarks(config, issue.state)}`
            output += `#${issue.number}: ${issue.title} [${labels.join(", ")}]`
            if (config.showState && !config.showMarks) output += ` ${issue.state}`
            if (config.showAssignees) output += ` [${issue.assignees.map(assignee => assignee.name).join(", ")}]`
            output += "\n"
            if (config.fileType === "md" && i !== issuesByMilestone.length - 1 && config.report.includes("-list")) output += "\n"
            if (config.blankLine) output += "\n"
        }
    }
    return output
}
