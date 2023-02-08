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
import { IContext, IPluginsLoaded } from "./doc";
import { Inputs } from "./inputs";

type Env = {
    cwd?: string;
    env?: Record<string, string>;
}

type Stage = {
    name: "fail" | "init" | "publish" | "success" | "version",
    canSkip?: boolean
}

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

/**
 * Run a stage for loaded plugins that have a registered handler.
 * If the plugin config defines $cwd or $env, then cwd and env vars will be
 * overridden in a temporary environment during the runtime of the handler.
 * @param context Global context object for Octorelease
 * @param pluginsLoaded Key-value pairs of plugin names and loaded modules
 * @param stage Stage to run
 */
async function runStage(context: IContext, pluginsLoaded: IPluginsLoaded, stage: Stage): Promise<void> {
    if (shouldSkipStage(stage)) {
        return;
    }

    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule[stage.name] == null) {
            continue;
        }

        for (const pluginConfig of (context.plugins[pluginName] || [])) {
            context.logger.info(`Running "${stage.name}" stage for plugin ${pluginName}`);
            const oldEnv = loadEnv({ cwd: pluginConfig.$cwd, env: pluginConfig.$env });
            context.logger.pluginName = pluginName;

            try {
                await (pluginModule[stage.name] as any)(context, pluginConfig);
            } finally {
                context.logger.pluginName = undefined;
                unloadEnv(oldEnv);
            }
        }
    }
}

/**
 * Check if stage should be skipped based on `Inputs.skipStages`.
 * @param stage Stage to check
 * @returns True if stage should be skipped
 */
function shouldSkipStage(stage: Stage): boolean {
    if (stage.canSkip !== false && Inputs.skipStages.includes(stage.name)) {
        core.info(`Skipping "${stage.name}" stage`);
        return true;
    }
    return false;
}

/**
 * Load temporary cwd and env vars from an environment object.
 * @param newEnv New environment to load
 * @returns Old environment that can be restored later
 */
function loadEnv(newEnv: Env): Env {
    const oldEnv: Env = {};
    if (newEnv.cwd != null) {
        oldEnv.cwd = process.cwd();
        process.chdir(path.resolve(newEnv.cwd));
    }

    oldEnv.env = {};
    for (const [k, v] of Object.entries(newEnv.env || {})) {
        oldEnv.env[k] = process.env[k] as string;
        process.env[k] = v.toString();
    }

    return oldEnv;
}

/**
 * Restore original cwd and env vars from an environment object.
 * @param oldEnv Old environment to restore
 */
function unloadEnv(oldEnv: Env) {
    if (oldEnv.cwd != null) {
        process.chdir(oldEnv.cwd);
    }

    for (const [k, v] of Object.entries(oldEnv.env || {})) {
        if (v != null) {
            process.env[k] = v.toString();
        } else {
            delete process.env[k];
        }
    }
}
