/**
 * Copyright 2020-2024 Zowe Actions Contributors
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
     * Mapping of plugin names to their file paths
     * @internal
     */
    public static pluginPathMap: Record<string, string> = {};

    constructor(private prefix?: string) {}

    /**
     * Output debug level message with plugin name prepended.
     * @param message Text to output
     */
    public debug(message: string): void {
        core.debug(this.addPrefix(message));
    }

    /**
     * Output error level message with plugin name prepended.
     * @param message Text to output
     */
    public error(message: string): void {
        core.error(this.addPrefix(message));
    }

    /**
     * Output info level message with plugin name prepended.
     * @param message Text to output
     */
    public info(message: string): void {
        core.info(this.addPrefix(message));
    }

    /**
     * Output warning level message with plugin name prepended.
     * @param message Text to output
     */
    public warn(message: string): void {
        core.warning(this.addPrefix(message));
    }

    /**
     * If prefix is defined for this logger, prepend it to message.
     * @param message Text to output
     * @returns Text with prefix prepended
     */
    private addPrefix(message: string): string {
        const tempPrefix = this.prefix ?? this.getPluginName();
        return tempPrefix ? `[${tempPrefix}] ${message}` : message;
    }

    /**
     * Searches the call stack for file paths associated with a plugin.
     * @returns Name of active plugin if one is found
     */
    private getPluginName(): string | undefined {
        const stackMatches = new Error().stack?.matchAll(/\s\((.+?):\d+:\d+\)$/gm);
        for (const match of (stackMatches || [])) {
            const callStackPath = match[1];
            const activePluginName = Object.keys(Logger.pluginPathMap)
                .find((pluginName) => callStackPath === Logger.pluginPathMap[pluginName]);
            if (activePluginName != null) {
                return activePluginName;
            }
        }
    }
}
