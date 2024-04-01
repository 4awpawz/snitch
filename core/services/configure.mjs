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
    config.debug = args.includes("--debug")
    const repo = args.find(arg => arg.startsWith("--repo="))
    config.repo = repo?.length > 0 && repo.split("=")[1] || JSON.parse(await ghGetRepoInfo()).url
    config.repo = repoURL(config.repo)
    const state = args.find(arg => arg.startsWith("--state="))
    config.state = state && state.length && state.split("=")[1] || "all"
    !["open", "closed", "all"].includes(config.state) &&
        reportAndExit(`open, closed, all are the only valid states, you entered ${config.state}`, "error")
    const maxIssues = args.find(arg => arg.startsWith("--max-issues="))
    config.maxIssues = maxIssues && parseInt(maxIssues.split("=")[1]) || 10000
    !Number.isInteger(config.maxIssues) && reportAndExit("max-issues must be an integer", "error")
    config.fileType = args.includes("--txt") && "txt" || "md"
    const reportName = args.find(arg => arg.startsWith("--name="))
    config.reportName = reportName && reportName.length && reportName.split("=")[1] || "list"
    if (!config.debug && !reportTypes.includes(config.reportName)) {
        console.error("------------------")
        console.error("Pick A Report Type")
        console.error("------------------")
        console.error(reportTypes.join("\n"))
        reportAndExit("invalid or missing report type, please provide one from the list above", "error")
    }
    const heading = args.find(arg => arg.startsWith("--heading="))
    config.heading = heading && heading.length && heading.split("=")[1] || (new URL(config.repo)).pathname.slice(1)
    const maxLength = args.find(arg => arg.startsWith("--max-length="))
    config.maxLength = maxLength && parseInt(maxLength.split("=")[1]) || 80
    !Number.isInteger(config.maxLength) && reportAndExit("max-length must be an integer", "error")
    config.wrap = args.includes("--wrap")
    config.crop = args.includes("--crop")
    if (config.wrap && config.crop)
        reportAndExit("--wrap and --crop are mutually excluse, please select only one", "error")
    if (!config.wrap && !config.crop) config.wrap = true
    return config
}
