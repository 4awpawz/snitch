import cp from "node:child_process"

const execSync = cp.execSync;

/*
 * Get repo info for current project.
 * Only called when repo url isn't supplied by user.
 */
export function ghGetRepoInfo() {
    const command = "gh repo view --json 'url,name'"
    const stdout = execSync(command)
    return stdout
}

export function ghGetIssues(config) {
    let command = "gh"
    let args = `issue list -L ${config.maxIssues} --state ${config.state} --json 'number,title,labels,milestone,state,assignees,url'`
    args = config.repo ? args + ` -R ${config.repo}` : args
    args = config.label ? args + ` --label '${config.label}'` : args
    args = config.assignee ? args + ` --assignee '${config.assignee}'` : args
    args = config.milestone ? args + ` --milestone '${config.milestone}'` : args
    if (config.debug) {
        console.log("debug gh command: ", `${command} ${args}`)
        return
    }
    const gh = cp.spawnSync(command, [args], { shell: true })
    return gh.stdout.toString()
}
