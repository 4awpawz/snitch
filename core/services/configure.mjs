import { ghGetRepoInfo } from "./gh.mjs"
import { reportTypes } from "../lib/reportTypes.mjs"
import { reportAndExit } from "../lib/reportAndExit.mjs"

function repoURL(repo) {
    const protocolHost = "https://github.com/"
    if (repo.startsWith(protocolHost)) return repo
    return protocolHost + repo
}

export async function configure(args) {
    let config = {}
    const reportName = args.find(arg => arg.startsWith("--name="))
    config.reportName = reportName && reportName.length && reportName.split("=")[1] || "list"
    const repo = args.find(arg => arg.startsWith("--repo="))
    config.repo = repo?.length > 0 && repo.split("=")[1] || JSON.parse(ghGetRepoInfo()).url
    config.repo = repoURL(config.repo)
    const state = args.find(arg => arg.startsWith("--state="))
    config.state = state && state.length && state.split("=")[1] || "all"
    !["open", "closed", "all"].includes(config.state) &&
        reportAndExit(`open, closed, all are the only valid states, you entered ${config.state}`, "error")
    const maxIssues = args.find(arg => arg.startsWith("--max-issues="))
    config.maxIssues = maxIssues && parseInt(maxIssues.split("=")[1]) || 10000
    !Number.isInteger(config.maxIssues) && reportAndExit("max-issues must be an integer", "error")
    config.nonInteractive = args.includes("--non-interactive")
    config.noHeading = args.includes("--no-heading")
    const heading = args.find(arg => arg.startsWith("--heading="))
    config.heading = heading && heading.length && heading.split("=")[1] || (new URL(config.repo)).pathname.slice(1)
    config.debug = args.includes("--debug")
    config.noAttribution = args.includes("--no-attribution")
    config.asText = args.includes("--as-text")
    if (!config.debug && !reportTypes.includes(config.reportName)) {
        console.error("------------------")
        console.error("Pick A Report Type")
        console.error("------------------")
        console.error(reportTypes.join("\n"))
        reportAndExit("invalid or missing report type, please provide one from the list above", "error")
    }
    return config
}
