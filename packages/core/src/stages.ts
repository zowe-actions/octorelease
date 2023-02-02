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

import * as path from "path";
import * as core from "@actions/core";
import { IContext, IPluginsLoaded, SYMBOL_PLUGIN_DIR } from "./doc";
import { Inputs } from "./inputs";

type StageName = "fail" | "init" | "publish" | "success" | "version";

/**
 * Run "fail" stage for loaded plugins that have a "fail" handler.
 * If "fail" is included in `Inputs.skipStages`, this stage will be skipped.
 * @param context Global context object for Octorelease
 * @param pluginsLoaded Key-value pairs of plugin names and loaded modules
 */
export async function fail(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    await runStage(context, pluginsLoaded, { name: "fail" });
}

/**
 * Run "init" stage for loaded plugins that have an "init" handler.
 * The "init" stage cannot be skipped.
 * @param context Global context object for Octorelease
 * @param pluginsLoaded Key-value pairs of plugin names and loaded modules
 */
export async function init(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    await runStage(context, pluginsLoaded, { name: "init", canSkip: false });
}

/**
 * Run "publish" stage for loaded plugins that have a "publish" handler.
 * If "publish" is included in `Inputs.skipStages`, this stage will be skipped.
 * @param context Global context object for Octorelease
 * @param pluginsLoaded Key-value pairs of plugin names and loaded modules
 */
export async function publish(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    await runStage(context, pluginsLoaded, { name: "publish" });
}

/**
 * Run "success" stage for loaded plugins that have a "success" handler.
 * If "success" is included in `Inputs.skipStages`, this stage will be skipped.
 * @param context Global context object for Octorelease
 * @param pluginsLoaded Key-value pairs of plugin names and loaded modules
 */
export async function success(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    await runStage(context, pluginsLoaded, { name: "success" });
}

/**
 * Run "version" stage for loaded plugins that have a "version" handler.
 * If "version" is included in `Inputs.skipStages`, this stage will be skipped.
 * @param context Global context object for Octorelease
 * @param pluginsLoaded Key-value pairs of plugin names and loaded modules
 */
export async function version(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    await runStage(context, pluginsLoaded, { name: "version" });
}

async function runStage(context: IContext, pluginsLoaded: IPluginsLoaded,
    stage: { name: StageName, canSkip?: boolean }): Promise<void> {
    if (stage.canSkip !== false && shouldSkipStage(stage.name)) {
        return;
    }

    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule[stage.name] != null) {
            const pluginConfig = context.plugins[pluginName] || {};
            let oldCwd: string | undefined;
            context.logger.info(`Running "${stage.name}" stage for plugin ${pluginName}`);
            if (pluginConfig[SYMBOL_PLUGIN_DIR] != null) {
                oldCwd = process.cwd();
                process.chdir(path.resolve(pluginConfig[SYMBOL_PLUGIN_DIR]));
            }
            context.logger.pluginName = pluginName;

            try {
                await (pluginModule[stage.name] as any)(context, pluginConfig);
            } finally {
                if (oldCwd != null) {
                    process.chdir(oldCwd);
                }
                context.logger.pluginName = undefined;
            }
        }
    }
}

/**
 * Check if stage should be skipped based on `Inputs.skipStages`.
 * @param name Name of stage to skip
 * @returns True if stage should be skipped
 */
function shouldSkipStage(name: StageName): boolean {
    if (Inputs.skipStages.includes(name)) {
        core.info(`Skipping "${name}" stage`);
        return true;
    }
    return false;
}
