import { ghGetIssueList } from "./services/gh.mjs"
import { reportAndExit } from "./lib/reportAndExit.mjs"
import { configure } from "./services/configure.mjs"
import { issuesReport } from "./services/reports/issuesReport.mjs"
import { issuesByMilestoneReport } from "./services/reports/issuesByMilestoneReport.mjs"
import { issuesByMilestoneAndLabelReport } from "./services/reports/issuesByMilestoneAndLabelReport.mjs"

export async function ghif(args) {
    const config = await configure(args)
    if (config.debug) console.error("debug config: ", config)
    const result = await ghGetIssueList(config)
    if (args.includes("--debug")) process.exit(0)
    const issues = JSON.parse(result)
    let output = ""
    if (config.heading.length) output += config.fileType === "md" ?
        `# ${config.heading}\n\n` : `${config.heading}\n\n`
    switch (config.reportName) {
        case "list":
            output += issuesReport(config, issues)
            break
        case "milestone":
            output += issuesByMilestoneReport(config, issues)
            break
        case "milestone-label":
            output += issuesByMilestoneAndLabelReport(config, issues)
            break
        default:
            throw new TypeError(`invalid report type, you entered ${config.reportName}`)
    }
    process.stdout.write(output)
    process.exit(0)
} 
