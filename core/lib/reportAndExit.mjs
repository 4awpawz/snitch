import chalk from "chalk"

export function reportAndExit(message, level = "warn") {
    const msgLevel = level === "warn" && chalk.blue || level === "error" && chalk.red
    console.error(msgLevel(message))
    process.exit(1)
}
