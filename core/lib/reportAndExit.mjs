import { chalkStderr } from "chalk"

export function reportAndExit(message, level = "warn") {
    const msgLevel = level === "warn" && chalkStderr.bgYellowBright.black || level === "error" && chalkStderr.bgRed.black
    let msgOut = (level === "warn" ? "Attention: " : "Error: ") + message
    console.error(msgLevel(msgOut))
    process.exit(1)
}
