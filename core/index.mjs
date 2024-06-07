import { ghGetIssues } from "./services/gh.mjs"
import { configure } from "./services/configure.mjs"
import { issuesReport } from "./services/reports/issuesReport.mjs"
import { issuesByMilestoneReport } from "./services/reports/issuesByMilestoneReport.mjs"
import { issuesByMilestoneAndLabelReport } from "./services/reports/issuesByMilestoneAndLabelReport.mjs"
import { issuesByLabelReport } from "./services/reports/issuesByLabelReport.mjs"
import { issuesByAssigneeReport } from "./services/reports/issuesByAssigneeReport.mjs"
import { renderInteractive } from "./lib/renderInteractive.mjs"
import { attributionText, snitchUrl } from "./lib/constants.mjs"

export async function snitch(args) {
    const config = await configure(args)
    if (config.debug) console.error("debug config: ", config)
    const result = ghGetIssues(config)
    if (args.includes("--debug")) process.exit(0)
    const issues = JSON.parse(result)
    let output = ""
    if (!config.noHeading && config.heading.length) output +=
        config.asText ? `${config.heading}` :
            renderInteractive(config,
                `<h1><a href="${config.repo}" target="_blank" title="link to repository ${config.repo}">${config.heading}</a></h1>`,
                `<h1>${config.heading}</h1>`)
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
        case "label":
            output += issuesByLabelReport(config, issues)
            break
        case "assignee":
            output += issuesByAssigneeReport(config, issues)
            break
        default:
            throw new TypeError(`invalid report type, you entered ${config.reportName}`)
    }
    if (!config.noAttribution && config.asText) output += "\n\n"
    if (!config.noAttribution) output +=
        config.asText ? `| ${attributionText} @ ${snitchUrl}` :
            `<blockquote><a href="${snitchUrl}" target="_blank">${attributionText}</a></blockquote>`
    process.stdout.write(output)
    process.exit(0)
} 
