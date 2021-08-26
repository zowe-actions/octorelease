import * as core from "@actions/core";

export class Logger {
    constructor(private pluginName?: string) {}

    public debug(message: string): void {
        core.debug(this.prependPluginName(message));
    }

    public error(message: string): void {
        core.error(this.prependPluginName(message));
    }

    public info(message: string): void {
        core.info(this.prependPluginName(message));
    }

    public warning(message: string): void {
        core.warning(this.prependPluginName(message));
    }

    private prependPluginName(message: string) {
        return this.pluginName ? `[${this.pluginName}] ${message}` : message;
    }
}
