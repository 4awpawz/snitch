import util from "node:util"
import child_process from "node:child_process"

const exec = util.promisify(child_process.exec);

/*
 * Get repo info for current project.
 * Only called when repo url isn't supplied by user.
 */
export async function ghGetRepoInfo() {
    const command = "gh repo view --json 'url,name'"
    const { stdout } = await exec(command)
    return stdout
}

export async function ghGetIssueList(config) {
    let command = `gh issue list -L ${config.maxIssues} --state ${config.state} --json 'number,title,labels,milestone,state,assignees,url'`
    command = config.repo ? command + ` -R ${config.repo}` : command
    if (config.debug) {
        console.log("debug gh command: ", command)
        return
    }
    const { stdout } = await exec(command)
    return stdout
}
