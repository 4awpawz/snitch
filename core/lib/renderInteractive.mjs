export function renderInteractive(config, interactive, nonInteractive) {
    return config.nonInteractive ? nonInteractive : interactive
}
