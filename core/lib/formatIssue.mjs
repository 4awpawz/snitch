export function formatIssue({ state, number, title, labels, assignees, milestone }) {
    return `${state} ${number} ${title} ${labels} ${assignees} ${milestone}`
}
