import { reportTypes } from "../lib/reportTypes.mjs"
import { reportAndExit } from "../lib/reportAndExit.mjs"

export function configure(args) {
    let config = {}
    const repo = args.find(arg => arg.startsWith("--repo="))
    if (repo) config.repo = repo.split("=")[1]
    const state = args.find(arg => arg.startsWith("--state="))
    config.state = state && state.length && state.split("=")[1] || "closed"
    const maxIssues = args.find(arg => arg.startsWith("--max-issues="))
    config.maxIssues = maxIssues && maxIssues.length && maxIssues.split("=")[1] || 300
    let report = args.find(arg => arg.startsWith("--issues-"))
    if (typeof report === "undefined" || !reportTypes.includes(report)) {
        console.error("------------------")
        console.error("Pick A Report Type")
        console.error("------------------")
        console.error(reportTypes.join("\n"))
        reportAndExit("invalid or missing report type, please provide one from the list above", "error")
    }
    config.report = report.slice(9)
    config.fileType = config.report.endsWith("md") && "md" || "txt"
    config.noWrap = args.includes("--no-wrap")
    const heading = args.find(arg => arg.startsWith("--heading="))
    config.heading = heading && heading.length && heading.split("=")[1] || ""
    config.blankLine = args.includes("--blank-line") && config.fileType === "txt"
    config.breakAfterTitle = args.includes("--break-after-title")
    config.prefix = config.report.includes("bulleted") && "bulleted" || config.report.includes("numbered") && "numbered" || "none"
    let show = args.find(arg => arg.startsWith("--show"))
    config.showState = show.includes("state")
    config.showURL = show.includes("url") && config.fileType === "md"
    config.showAssignees = show.includes("assignees")
    config.showMarks = show.includes("marks")
    config.showColor = show.includes("color")
    if (args.includes("--debug")) console.log("debug config: ", config)
    return config
}
