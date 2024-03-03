import chalk from "chalk"
import { configure } from "./services/configure.mjs"
import { listIssues } from "./services/reports/listIssues.mjs"
import { groupIssuesByMilestoneAndLabel } from "./services/reports/groupIssuesByMilestoneAndLabel.mjs"
import { groupIssuesByMilestone } from "./services/reports/groupIssuesByMilestone.mjs"

async function getPipedIn() {
    let data = ""
    for await (const chunk of process.stdin) {
        data += chunk
    }
    return data
}

function missingMilestone(issues) {
    let missing = false
    for (const issue of issues) {
        if (typeof issue.milestone === "undefined" || issue.milestone === null) {
            missing = true
            console.log(chalk.red(`issue ${issue.number} is missing milestone`))
        }
    }
    return missing
}

function missingLabel(issues) {
    let missing = false
    for (const issue of issues) {
        if (typeof issue.labels === "undefined" || issue.labels === null || issue.labels.length === 0) {
            missing = true
            console.log(chalk.red(`issue ${issue.number} is missing label`))
        }
    }
    return missing
}

export async function ghif(args) {
    const config = configure(args)
    let issues
    try {
        issues = JSON.parse(await getPipedIn())
    } catch (error) {
        throw new Error("ghif require gh issue list to include the --json \"number,title,labels,milestone\"  options")
    }
    // if one or more issues hasn't been assigned a milestone or a label then report them and terminate
    const mm = missingMilestone(issues)
    const ml = missingLabel(issues)
    if (mm || ml) process.exit(1)
    // OK to continue
    let output = ""
    // write out the header respecting the media type of the document
    const heading = config.heading !== "" && config.report.endsWith(("-md")) ? `# ${config.heading} ` : config.heading;
    output = config.heading !== "" && heading + "\n" || output
    switch (config.report) {
        case "list-txt":
        case "list-md":
        case "list-bulleted-txt":
        case "list-bulleted-md":
        case "list-numbered-txt":
        case "list-numbered-md":
            output += listIssues(config, issues)
            break
        case "milestone-list-txt":
        case "milestone-list-md":
        case "milestone-bulleted-txt":
        case "milestone-bulleted-md":
        case "milestone-numbered-txt":
        case "milestone-numbered-md":
            output += groupIssuesByMilestone(config, issues)
            break
        case "milestone-label-list-txt":
        case "milestone-label-list-md":
        case "milestone-label-bulleted-txt":
        case "milestone-label-bulleted-md":
        case "milestone-label-numbered-txt":
        case "milestone-label-numbered-md":
            output += groupIssuesByMilestoneAndLabel(config, issues)
            break
    }
    process.stdout.write(output)
} 
