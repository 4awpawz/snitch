import { reportTypes } from "../lib/reportTypes.mjs"
import { reportAndExit } from "../lib/reportAndExit.mjs"

export function configure(args) {
    let config = {}
    config.debug = args.includes("--debug")
    const repo = args.find(arg => arg.startsWith("--repo="))
    if (repo) config.repo = repo.split("=")[1]
    const state = args.find(arg => arg.startsWith("--state="))
    config.state = state && state.length && state.split("=")[1] || "closed"
    const maxIssues = args.find(arg => arg.startsWith("--max-issues="))
    config.maxIssues = maxIssues && maxIssues.length && maxIssues.split("=")[1] || 300
    config.fileType = args.includes("--txt") && "txt" || "md"
    const reportName = args.find(arg => arg.startsWith("t--name="))
    config.reportName = reportName && reportName.length && reportName.split("=")[1] || "list"
    if (!config.debug && !reportTypes.includes(config.reportName)) {
        console.error("------------------")
        console.error("Pick A Report Type")
        console.error("------------------")
        console.error(reportTypes.join("\n"))
        reportAndExit("invalid or missing report type, please provide one from the list above", "error")
    }
    const heading = args.find(arg => arg.startsWith("--heading="))
    config.heading = heading && heading.length && heading.split("=")[1] || ""
    return config
}
