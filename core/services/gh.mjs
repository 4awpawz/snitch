import util from "node:util"
import child_process from "node:child_process"

export async function gh(config) {
    const exec = util.promisify(child_process.exec);
    const command = `gh issue list -L 100000 --state ${config.state} --json 'number,title,labels,milestone,state' -R ${config.repo}`
    const { stdout } = await exec(command)
    return stdout
}
