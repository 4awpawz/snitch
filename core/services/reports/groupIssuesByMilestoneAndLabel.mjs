import { reportAndExit } from "../../lib/reportAndExit.mjs"
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
        output += (config.filetype === "md" ? `## ${milestone.title}` : `${milestone.title}`)
        if (milestone.dueOn) output += ` (${milestone.dueOn.substring(0, 10)})`
        output += "\n\n"
        const issuesByMilestone = issues.filter(issue => issue.milestone.title === milestone.title)
        let labelsByMilestone = issuesByMilestone.reduce((accum, currentValue) => {
            currentValue.labels.forEach(label => !accum.includes(label.name) && accum.push(label.name))
            return accum
        }, [])
        labelsByMilestone.sort((a, b) => {
            if (a > b) return 1
            if (a < b) return -1
            return 0
        })
        for (const label of labelsByMilestone) {
            const issuesBylabel = issuesByMilestone.reduce((accum, currentValue) => {
                currentValue.labels.forEach(lbl => lbl.name === label && accum.push(currentValue))
                return accum
            }, [])
            output += (config.filetype === "md" ? `### ${label}` : `${label}`) + ` (${issuesBylabel.length})` + "\n\n"
            let lineItemNumber = 1
            for (const issue of issuesBylabel) {
                output += prefix(config, lineItemNumber)
                lineItemNumber++
                output += `#${issue.number}: ${issue.title}\n`
                if (config.filetype === "md" && config.report.includes("list")) output += "\n"
                if (config.blankline) output += "\n"
            }
            output += "\n"
        }
    }
    return output
}
