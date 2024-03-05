import { reportTypes } from "../lib/reportTypes.mjs"
import { reportAndExit } from "../lib/reportAndExit.mjs"

export function configure(args) {
    let config = {}
    // For gh.
    // Omit repo property if --repo is not provided so gh can use the repo associated with the current project
    const repo = args.find(arg => arg.startsWith("--repo="))
    if (repo) config.repo = repo.split("=")[1]
    const state = args.find(arg => arg.startsWith("--state="))
    config.state = state && state.length && state.split("=")[1] || "closed"
    const maxIssues = args.find(arg => arg.startsWith("--max-issues="))
    config.maxIssues = maxIssues && maxIssues.length && maxIssues.split("=")[1] || 300
    // For ghif.
    const report = args.find(arg => arg.startsWith("--report-"))
    if (!reportTypes.includes(report))
        reportAndExit(`missing or invalid report type, you entered ${config.report} `, "error")
    config.report = report.slice(9)
    const heading = args.find(arg => arg.startsWith("--heading="))
    config.fileType = config.report.endsWith("md") && "md" || "txt"
    config.heading = heading && heading.length && heading.split("=")[1] || ""
    config.colorizedLabels = config.fileType === "md" && args.includes("--colorized-labels")
    config.blankLine = config.fileType === "txt" && args.includes("--blank-line")
    config.prefix = config.report.includes("bulleted") && "bulleted" || config.report.includes("numbered") && "numbered" || "none"
    let show = args.find(arg => arg.startsWith("--show"))
    config.showState = show.includes("state")
    config.showAssignees = show.includes("assignees")
    config.showMarks = show.includes("marks")
    if (args.includes("--debug")) console.log("debug config: ", config)
    return config
}
