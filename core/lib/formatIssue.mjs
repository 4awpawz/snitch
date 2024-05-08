export function formatIssue({ state, number, title, labels, assignees, milestone }) {
    const template = `${state} ${number} ${title} ${labels} ${assignees} ${milestone}\n`
    return template
}
