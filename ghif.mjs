import chalk from "chalk"

async function getPipedIn() {
    let data = ""
    for await (const chunk of process.stdin) {
        data += chunk
    }
    return data
}

function sortMilestoneLabels(milestoneLabels) {
    return milestoneLabels.sort((a, b) => {
        if (a > b) return 1
        if (a < b) return -1
        return 0
    })
}

function reportAndExit(message, level = "warn") {
    const msgLevel = level === "warn" && chalk.blue || level === "error" && chalk.red
    console.log(chalk.red(msgLevel(message)))
    process.exit(1)
}

function prefix(config, lineItemNumber) {
    if (config.prefix === "none") return ""
    if (config.prefix === "numbered" && config.filetype === "md") return "1. "
    if (config.prefix === "numbered" && config.filetype === "txt") return `${lineItemNumber}. `
    if (config.prefix === "bulleted") return "- "
    throw new TypeError("prefix undefined")
}

function listIssues(config, issues) {
    if (issues.length === 0) reportAndExit("No issues to report")
    let output = ""
    let lineItemNumber = 1
    output += "\n"
    for (const issue of issues) {
        let labels = config.filetype === "md" && config.colorizedlabels ? issue.labels.map(label => `<span style="color: #${label.color};">${label.name}</span>`) :
            issue.labels.map(label => label.name)
        issue.labels.map(label => label.name)
        output += prefix(config, lineItemNumber)
        lineItemNumber++
        output += `#${issue.number}: ${issue.title} [${labels.join(", ")}]\n`
        if (config.filetype === "md" && config.report.includes("list")) output += "\n"
        if (config.blankline) output += "\n"
    }
    return output
}

function groupIssuesByMileStoneAndLabel(config, issues) {
    if (issues.length === 0) reportAndExit("No issues to report")
    const milestones = issues.reduce((accum, currentvalue) => {
        const hasMilestone = accum.some(milestone => milestone.title === currentvalue.milestone.title)
        !hasMilestone && accum.push({ title: currentvalue.milestone.title, dueOn: currentvalue.milestone.dueOn })
        return accum
    }, [])
    let output = ""
    for (const milestone of milestones) {
        output += "\n"
        output += (config.filetype === "md" ? `## ${milestone.title}` : `${milestone.title}`)
        if (milestone.dueOn) output += ` (${milestone.dueOn.substring(0, 10)})`
        output += "\n\n"
        const issuesByMilestone = issues.filter(issue => issue.milestone.title === milestone.title)
        const labelsByMilestone = issuesByMilestone.reduce((accum, currentValue) => {
            currentValue.labels.forEach(label => !accum.includes(label.name) && accum.push(label.name))
            return accum
        }, [])
        sortMilestoneLabels(labelsByMilestone)
        for (const label of labelsByMilestone) {
            const issuesBylabel = issuesByMilestone.reduce((accum, currentValue) => {
                currentValue.labels.forEach(lbl => lbl.name === label && accum.push(currentValue))
                return accum
            }, [])
            output += (config.filetype === "md" ? `### ${label}` : `${label}`) + ` (${issuesBylabel.length})` + "\n\n"
            let lineItemNumber = 1
            for (const issue of issuesBylabel) {
                let labels = config.filetype === "md" && config.colorizedlabels ? issue.labels.map(label => `<span style="color: #${label.color};">${label.name}</span>`) :
                    issue.labels.map(label => label.name)
                output += prefix(config, lineItemNumber)
                lineItemNumber++
                output += `#${issue.number}: ${issue.title} [${labels.join(", ")}]\n`
                if (config.filetype === "md" && config.report.includes("list")) output += "\n"
                if (config.blankline) output += "\n"
            }
            output += "\n"
        }
    }
    return output
}

function groupIssuesByMileStone(config, issues) {
    if (issues.length === 0) reportAndExit("No issues to report")
    const milestones = issues.reduce((accum, currentvalue) => {
        const hasMilestone = accum.some(milestone => milestone.title === currentvalue.milestone.title)
        !hasMilestone && accum.push({ title: currentvalue.milestone.title, dueOn: currentvalue.milestone.dueOn })
        return accum
    }, [])
    let output = ""
    for (const milestone of milestones) {
        output += "\n"
        output += (config.filetype === "md" ? `## ${milestone.title}` : `${milestone.title}`)
        if (milestone.dueOn) output += ` (${milestone.dueOn.substring(0, 10)})`
        output += "\n\n"
        const issuesByMilestone = issues.filter(issue => issue.milestone.title === milestone.title)
        let lineItemNumber = 1
        for (const issue of issuesByMilestone) {
            let labels = config.filetype === "md" && config.colorizedlabels ? issue.labels.map(label => `<span style="color: #${label.color};">${label.name}</span>`) :
                issue.labels.map(label => label.name)
            output += prefix(config, lineItemNumber)
            lineItemNumber++
            output += `#${issue.number}: ${issue.title} [${labels.join(", ")}]\n`
            if (config.filetype === "md" && config.report.includes("list")) output += "\n"
            if (config.blankline) output += "\n"
        }
    }
    return output
}

function configure(args) {
    const reportTypes = [
        "--report-list-txt",
        "--report-list-md",
        "--report-list-bulleted-txt",
        "--report-list-bulleted-md",
        "--report-list-numbered-txt",
        "--report-list-numbered-md",
        "--report-milestone-list-txt",
        "--report-milestone-list-md",
        "--report-milestone-bulleted-txt",
        "--report-milestone-bulleted-md",
        "--report-milestone-numbered-txt",
        "--report-milestone-numbered-md",
        "--report-milestone-label-list-txt",
        "--report-milestone-label-list-md",
        "--report-milestone-label-bulleted-txt",
        "--report-milestone-label-bulleted-md",
        "--report-milestone-label-numbered-txt",
        "--report-milestone-label-numbered-md",
    ]
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

function missingMilestone(issues) {
    let missing = false
    for (const issue of issues) {
        if (typeof issue.milestone === "undefined" || issue.milestone === null) {
            missing = true
            // console.log(chalk.red(`issue ${issue.number} is missing milestone`))
            console.log(chalk.red(`issue ${issue.number} is missing milestone`))
        }
    }
    return missing
}

function missingLabel(issues) {
    let missing = false
    for (const issue of issues) {
        if (typeof issue.labels === "undefined" || issue.labels === null || issue.labels.length === 0) {
            missing = true
            console.log(chalk.red(`issue ${issue.number} is missing label`))
        }
    }
    return missing
}

export async function ghif(args) {
    const config = configure(args)
    let issues
    try {
        issues = JSON.parse(await getPipedIn())
    } catch (error) {
        throw new Error("ghif require gh issue list to include the --json \"number,title,labels,milestone\"  options")
    }
    // if one or more issues hasn't been assigned a milestone or a label then report them and terminate
    const mm = missingMilestone(issues)
    const ml = missingLabel(issues)
    if (mm || ml) process.exit(1)
    // OK to continue
    let output = ""
    // write out the header respecting the media type of the document
    const heading = config.heading !== "" && config.report.endsWith(("-md")) ? `# ${config.heading} ` : config.heading;
    output = config.heading !== "" && heading + "\n" || output
    switch (config.report) {
        case "list-txt":
        case "list-md":
        case "list-bulleted-txt":
        case "list-bulleted-md":
        case "list-numbered-txt":
        case "list-numbered-md":
            output += listIssues(config, issues)
            break
        case "milestone-list-txt":
        case "milestone-list-md":
        case "milestone-bulleted-txt":
        case "milestone-bulleted-md":
        case "milestone-numbered-txt":
        case "milestone-numbered-md":
            output += groupIssuesByMileStone(config, issues)
            break
        case "milestone-label-list-txt":
        case "milestone-label-list-md":
        case "milestone-label-bulleted-txt":
        case "milestone-label-bulleted-md":
        case "milestone-label-numbered-txt":
        case "milestone-label-numbered-md":
            output += groupIssuesByMileStoneAndLabel(config, issues)
            break
    }
    process.stdout.write(output)
} 
