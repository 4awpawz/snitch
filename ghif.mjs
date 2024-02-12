function getArgs() {
    return process.argv.slice(2)
}

async function getPipedIn() {
    let data = ""
    for await (const chunk of process.stdin) {
        data += chunk
    }
    return data
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

export async function ghif() {
    const args = getArgs()
    const markdown = (argsHaveMarkdownUnOrderedList(args) && "- ") || (argsHaveMarkdownOrderedList(args) && "0. ") || ""
    const blankLineBetweenIssues = argsHaveBlankLineBetweenIssues(args)
    const json = JSON.parse(await getPipedIn())
    let issues = ""
    json.forEach((obj, index) => {
        const title = obj.title
        const number = obj.number
        const labels = obj.labels.map(label => label.name)
        issues += `${markdown}#${number}: ${title} [${labels.join(", ")}]\n${(blankLineBetweenIssues && index < json.length - 1) && "\n" || ""}`
    })

    process.stdout.write(issues)
} 
