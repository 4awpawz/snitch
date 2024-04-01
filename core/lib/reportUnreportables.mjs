import { chalkStderr } from "chalk"

export function reportUnreportables(config, issues, filter) {
    const count = issues.filter(issue => filter(issue)).length
    if (count === 0) return
    if (count === 1) console.error(chalkStderr.bgYellowBright(`1 issue out of a total of ${issues.length} does not meet the requirements for this ${config.reportName} report!`))
    if (count > 1) console.error(chalkStderr.bgYellowBright(`${count} issues out of a total of ${issues.length} do not meet the requirements for this ${config.reportName} report!`))
}
