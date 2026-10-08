/**
 * Copyright 2020-202X Zowe Actions Contributors
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

import * as fs from "fs";
import * as path from "path";

// Not plugins -- "core" is Octorelease's own SDK/CLI, "index" is its CLI bundle,
// and the last is this package's own name -- never exposed on IPluginApi.
const NON_PLUGIN_NAMES = ["core", "index", (require("../package.json").name as string).replace("@octorelease/", "")];

/**
 * Provides lazy access to each of Octorelease's built-in plugin packages, so
 * scripts can use any of them (e.g. "plugins.lerna.version") without a static
 * import, and without eagerly loading plugins they don't end up using. The
 * set of available plugins is discovered at runtime rather than hardcoded
 * here, so new plugins are picked up automatically. Weakly typed since
 * what's available can't be known statically, and scripts using this API
 * will typically be plain JavaScript anyway.
 */
export type IPluginApi = Record<string, any>;

/**
 * Discover the names of available Octorelease plugins. In development/tests
 * this reads the "@octorelease" packages installed alongside this one; when
 * bundled as a GitHub Action (no node_modules present) it instead reads the
 * sibling ".js" files in the "dist" folder where plugins are bundled.
 */
function discoverPluginNames(): string[] {
    const workspaceScope = path.resolve("./node_modules/@octorelease");
    if (fs.existsSync(workspaceScope)) {
        return fs.readdirSync(workspaceScope).filter((name) => !NON_PLUGIN_NAMES.includes(name));
    }
    return fs
        .readdirSync(__dirname)
        .filter((file) => file.endsWith(".js"))
        .map((file) => file.slice(0, -".js".length))
        .filter((name) => !NON_PLUGIN_NAMES.includes(name));
}

/**
 * Resolve a built-in plugin package the same way Octorelease's own plugin
 * loader does: from node_modules if present (e.g. in this monorepo or a
 * consumer that installed it directly), otherwise from the "dist" folder
 * where it is bundled alongside this script when run as a GitHub Action.
 */
function resolvePluginPath(pluginName: string): string {
    let pluginPath = `./node_modules/@octorelease/${pluginName}`;
    if (!fs.existsSync(pluginPath)) {
        pluginPath = path.join(__dirname, pluginName);
    }
    return path.resolve(pluginPath);
}

export function createPluginApi(): IPluginApi {
    const cache: Record<string, unknown> = {};
    const api: IPluginApi = {};
    for (const pluginName of discoverPluginNames()) {
        Object.defineProperty(api, pluginName, {
            enumerable: true,
            get(): unknown {
                if (!(pluginName in cache)) {
                    cache[pluginName] = require(resolvePluginPath(pluginName));
                }
                return cache[pluginName];
            },
        });
    }
    return api;
}
