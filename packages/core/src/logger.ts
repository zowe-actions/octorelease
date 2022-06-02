/**
 * Copyright 2022 Octorelease Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as core from "@actions/core";

/**
 * Class for logging messages to the console.
 */
export class Logger {
    /**
     * Plugin name to prepend to log messages.
     * @internal
     */
    public pluginName?: string;

    constructor(pluginName?: string) {
        this.pluginName = pluginName;
    }

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
    public warn(message: string): void {
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
