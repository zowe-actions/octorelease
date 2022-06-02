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
import { IContext, IPluginsLoaded } from "./doc";
import { Inputs } from "./inputs";

/**
 * Run "fail" stage for loaded plugins that have a "fail" handler.
 * If "fail" is included in `Inputs.skipStages`, this stage will be skipped.
 * @param context Global context object for Octorelease
 * @param pluginsLoaded Key-value pairs of plugin names and loaded modules
 */
export async function fail(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    if (shouldSkipStage("fail")) return;
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.fail != null) {
            context.logger.info(`Running "fail" stage for plugin ${pluginName}`);
            context.logger.pluginName = pluginName;
            try {
                await pluginModule.fail(context, context.plugins[pluginName] || {});
            } finally {
                context.logger.pluginName = undefined;
            }
        }
    }
}

/**
 * Run "init" stage for loaded plugins that have an "init" handler.
 * The "init" stage cannot be skipped.
 * @param context Global context object for Octorelease
 * @param pluginsLoaded Key-value pairs of plugin names and loaded modules
 */
export async function init(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.init != null) {
            context.logger.info(`Running "init" stage for plugin ${pluginName}`);
            context.logger.pluginName = pluginName;
            try {
                await pluginModule.init(context, context.plugins[pluginName] || {});
            } finally {
                context.logger.pluginName = undefined;
            }
        }
    }
}

/**
 * Run "publish" stage for loaded plugins that have a "publish" handler.
 * If "publish" is included in `Inputs.skipStages`, this stage will be skipped.
 * @param context Global context object for Octorelease
 * @param pluginsLoaded Key-value pairs of plugin names and loaded modules
 */
export async function publish(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    if (shouldSkipStage("publish")) return;
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.publish != null) {
            context.logger.info(`Running "publish" stage for plugin ${pluginName}`);
            context.logger.pluginName = pluginName;
            try {
                await pluginModule.publish(context, context.plugins[pluginName] || {});
            } finally {
                context.logger.pluginName = undefined;
            }
        }
    }
}

/**
 * Run "success" stage for loaded plugins that have a "success" handler.
 * If "success" is included in `Inputs.skipStages`, this stage will be skipped.
 * @param context Global context object for Octorelease
 * @param pluginsLoaded Key-value pairs of plugin names and loaded modules
 */
export async function success(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    if (shouldSkipStage("success")) return;
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.success != null) {
            context.logger.info(`Running "success" stage for plugin ${pluginName}`);
            context.logger.pluginName = pluginName;
            try {
                await pluginModule.success(context, context.plugins[pluginName] || {});
            } finally {
                context.logger.pluginName = undefined;
            }
        }
    }
}

/**
 * Run "version" stage for loaded plugins that have a "version" handler.
 * If "version" is included in `Inputs.skipStages`, this stage will be skipped.
 * @param context Global context object for Octorelease
 * @param pluginsLoaded Key-value pairs of plugin names and loaded modules
 */
export async function version(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    if (shouldSkipStage("version")) return;
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.version != null) {
            context.logger.info(`Running "version" stage for plugin ${pluginName}`);
            context.logger.pluginName = pluginName;
            try {
                await pluginModule.version(context, context.plugins[pluginName] || {});
            } finally {
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
function shouldSkipStage(name: "fail" | "publish" | "success" | "version"): boolean {
    if (Inputs.skipStages.includes(name)) {
        core.info(`Skipping "${name}" stage`);
        return true;
    }
    return false;
}
