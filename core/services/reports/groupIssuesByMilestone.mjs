import { reportAndExit } from "../../lib/reportAndExit.mjs"
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
        output += (config.filetype === "md" ? `## ${milestone.title}` : `${milestone.title}`)
        if (milestone.dueOn) output += ` (${milestone.dueOn.substring(0, 10)})`
        output += "\n\n"
        const issuesByMilestone = issues.filter(issue => issue.milestone.title === milestone.title)
        let lineItemNumber = 1
        for (let i = 0; i < issuesByMilestone.length; i++) {
            const issue = issuesByMilestone[i]
            let labels = issue.labels.sort((a, b) => {
                if (a.name > b.name) return 1
                if (a.name < b.name) return -1
                return 0
            })
            labels = config.filetype === "md" && config.colorizedlabels ?
                labels.map(label => `<span style="color: #${label.color};">${label.name}</span>`) :
                labels.map(label => label.name)
            output += prefix(config, lineItemNumber)
            lineItemNumber++
            output += `#${issue.number}: ${issue.title} [${labels.join(", ")}]\n`
            if (config.filetype === "md" && i !== issuesByMilestone.length - 1 && config.report.includes("-list")) output += "\n"
            if (config.blankline) output += "\n"
        }
    }
    return output
}
