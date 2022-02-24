import * as core from "@actions/core";

/**
 * Class for logging messages to the console.
 */
export class Logger {
    constructor(private pluginName?: string) {}

    /**
     * Output debug level message with plugin name prepended.
     * @param message Text to output
     */
    public debug(message: string): void {
        core.debug(this.prependPluginName(message));
    }

    /**
     * Output error level message with plugin name prepended.
     * @param message Text to output
     */
    public error(message: string): void {
        core.error(this.prependPluginName(message));
    }

    /**
     * Output info level message with plugin name prepended.
     * @param message Text to output
     */
    public info(message: string): void {
        core.info(this.prependPluginName(message));
    }

    /**
     * Output warning level message with plugin name prepended.
     * @param message Text to output
     */
    public warning(message: string): void {
        core.warning(this.prependPluginName(message));
    }

    /**
     * If plugin name is defined for this logger, prepend it to message.
     * @param message Text to output
     * @returns Text with plugin name prepended
     */
    private prependPluginName(message: string) {
        return this.pluginName ? `[${this.pluginName}] ${message}` : message;
    }
}
