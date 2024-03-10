import { chalkStderr } from "chalk"

export function reportAndExit(message, level = "warn") {
    const msgLevel = level === "warn" && chalkStderr.bgYellowBright || level === "error" && chalkStderr.red
    let msgOut = (level === "warn" ? "Attention: " : "Error: ") + message
    console.error(msgLevel(msgOut))
    process.exit(1)
}
