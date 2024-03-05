import { gh } from "./services/gh.mjs"
import { sanitize } from "./services/sanitize.mjs"
import { reportAndExit } from "./lib/reportAndExit.mjs"
import { configure } from "./services/configure.mjs"
import { listIssues } from "./services/reports/listIssues.mjs"
import { groupIssuesByMilestoneAndLabel } from "./services/reports/groupIssuesByMilestoneAndLabel.mjs"
import { groupIssuesByMilestone } from "./services/reports/groupIssuesByMilestone.mjs"

export async function ghif(args) {
    const config = configure(args)
    if (config.maxIssues && !Number.isInteger(parseInt(config.maxIssues))) reportAndExit("maxIssues must be an integer", "error")
    let issues
    try {
        const result = await gh(config, args)
        if (args.includes("--debug")) process.exit(0)
        issues = JSON.parse(result)
    } catch (error) {
        // TODO: this isn't right, should just log the error and exit.
        console.error(error)
        reportAndExit("something went wrong", "error")
    }
    issues = sanitize(issues)
    let output = ""
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
    process.exit(0)
} 
