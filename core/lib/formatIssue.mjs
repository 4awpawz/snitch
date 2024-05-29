export function formatIssue({ state, number, title, labels, assignees, milestone }) {
    let template = `${state} ${number} ${title} ${labels} ${assignees} ${milestone}`
    return template
}
