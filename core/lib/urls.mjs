export function labelUrl(config, label) {
    return `${config.repo}/labels/${label.name}`
}

export function milestoneUrl(config, milestone) {
    return `${config.repo}/milestone/${milestone.number}`
}

export function assigneeUrl(config, assignee) {
    return `<a href="${config.repo}/issues/assigned/${assignee.login}" target="_blank">${assignee.name}</a>`
}
