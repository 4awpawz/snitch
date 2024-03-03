import chalk from "chalk"

export function reportAndExit(message, level = "warn") {
    const msgLevel = level === "warn" && chalk.blue || level === "error" && chalk.red
    console.log(msgLevel(message))
    process.exit(1)
}
