import { reportTypes } from "../lib/reportTypes.mjs"
import { reportAndExit } from "../lib/reportAndExit.mjs"

export function configure(args) {
    let config = {}
    config.report = args.find(arg => arg.startsWith("--report-"))
    if (!reportTypes.includes(config.report))
        reportAndExit(`missing or invalid report type, you entered ${config.report} `, "error")
    config.report = config.report.slice(9)
    config.heading = args.find(arg => arg.startsWith("--heading="))
    config.heading = config.heading && config.heading.length && config.heading.split("=")[1] || ""
    config.colorizedlabels = config.report.endsWith("-md") && args.includes("--colorized-labels")
    config.filetype = config.report.endsWith("-md") && "md" || "txt"
    config.blankline = args.includes("--blank-line") && config.filetype === "txt"
    config.prefix = config.report.includes("bulleted") && "bulleted" || config.report.includes("numbered") && "numbered" || "none"
    return config
}
