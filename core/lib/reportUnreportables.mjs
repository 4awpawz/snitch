import { chalkStderr } from "chalk"

export function reportUnreportables(config, issues, filter) {
    const count = issues.filter(issue => filter(issue)).length
    if (count === 0) return
    const preface = count === 1 ? "1 issue" : `${count} issues`
    console.error(chalkStderr.black.bgYellow(`${preface} out of a total of ${issues.length} do not meet the requirements for this ${config.reportName} report!`))
}
