import chalk from "chalk"

async function getPipedIn() {
    let data = ""
    for await (const chunk of process.stdin) {
        data += chunk
    }
    return data
}

function argsHaveText(args) {
    return args.some(arg => arg === "--text")
}

function argsHaveMarkdownList(args) {
    return args.some(arg => arg === "--markdown-list")
}

function argsHaveMarkdownUnOrderedList(args) {
    return args.some(arg => arg === "--markdown-unordered-list")
}

function argsHaveMarkdownOrderedList(args) {
    return args.some(arg => arg === "--markdown-ordered-list")
}

function argsHaveBlankLineBetweenIssues(args) {
    return args.some(arg => arg === "--blank-line-between-issues")
}

function argsHaveColoredLabels(args) {
    return args.some(arg => arg === "--colored-labels")
}

function argsHaveAHeader(args) {
    return args.some(arg => arg.startsWith("--header="))
}

function getHeader(args) {
    return args.filter(arg => arg.startsWith("--header="))[0].split("=")[1] + "\n\n"
}

function exitWithMessage(message) {
    console.error(chalk.red(message))
    process.exit(1)
}

export async function ghif(args) {
    const prefix = (argsHaveMarkdownUnOrderedList(args) && "- ") || (argsHaveMarkdownOrderedList(args) && "1. ") || ""
    const blankLineBetweenIssues = argsHaveBlankLineBetweenIssues(args) || argsHaveMarkdownList(args)
    const coloredLabels = argsHaveColoredLabels(args)
    const isMarkdown = argsHaveMarkdownList(args) || argsHaveMarkdownOrderedList(args) || argsHaveMarkdownUnOrderedList(args)
    const isText = argsHaveText(args)
    const header = argsHaveAHeader(args) && getHeader(args)
    if (!isMarkdown && !isText) exitWithMessage("error: expected to find format option of --text, --markdown-list, --markdown-ordered-list, or --markdown-unordered-list but found none")
    let json
    try {
        json = JSON.parse(await getPipedIn())
    } catch (error) {
        exitWithMessage("error: ghif requires gh issue to include the --json \"number,title,labels\"  options")
    }
    let issues = ""
    issues += header && header
    json.forEach((obj, index) => {
        const title = obj.title
        const number = obj.number
        let labels = coloredLabels && isMarkdown ? obj.labels.map(label => `<span style="color: #${label.color};">${label.name}</span>`)
            : obj.labels.map(label => label.name)
        issues += `${prefix}#${number}: ${title} [${labels.join(", ")}]\n${(blankLineBetweenIssues && index < json.length - 1) && "\n" || ""}`
    })

    process.stdout.write(issues)
} 
