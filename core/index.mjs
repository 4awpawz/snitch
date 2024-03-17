import { gh } from "./services/gh.mjs"
// import { sanitize } from "./services/sanitize.mjs"
import { reportAndExit } from "./lib/reportAndExit.mjs"
import { configure } from "./services/configure.mjs"
import { listIssues } from "./services/reports/listIssues.mjs"
import { groupIssuesByMilestoneAndLabel } from "./services/reports/groupIssuesByMilestoneAndLabel.mjs"
import { groupIssuesByMilestone } from "./services/reports/groupIssuesByMilestone.mjs"

export async function ghif(args) {
    const config = configure(args)
    if (config.debug) console.error("debug config: ", config)
    if (config.maxIssues && !Number.isInteger(parseInt(config.maxIssues))) reportAndExit("maxIssues must be an integer", "error")
    let issues
    try {
        const result = await gh(config)
        if (args.includes("--debug")) process.exit(0)
        issues = JSON.parse(result)
    } catch (error) {
        console.error(error)
        reportAndExit("something went wrong", "error")
    }
    let output = ""
    const heading = config.heading !== "" && config.fileType === "-md" ? `# ${config.heading} ` : config.heading
    output = config.heading !== "" && heading + "\n" || output
    switch (config.reportName) {
        case "list":
            output += listIssues(config, issues)
            break
        case "milestone":
            output += groupIssuesByMilestone(config, issues)
            break
        case "milestone-label":
            output += groupIssuesByMilestoneAndLabel(config, issues)
            break
        default:
            throw new TypeError(`invalid report type, you entered ${config.reportName}`)
    }
    process.stdout.write(output)
    process.exit(0)
} 
