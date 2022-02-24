import * as core from "@actions/core";
import { IContext, IPluginsLoaded } from "./doc";
import { Inputs } from "./inputs";
import { Logger } from "./logger";

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
            await pluginModule.fail(
                { ...context, logger: new Logger(pluginName) },
                context.plugins[pluginName] || {}
            );
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
            await pluginModule.init(
                { ...context, logger: new Logger(pluginName) },
                context.plugins[pluginName] || {}
            );
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
            await pluginModule.publish(
                { ...context, logger: new Logger(pluginName) },
                context.plugins[pluginName] || {}
            );
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
            await pluginModule.success(
                { ...context, logger: new Logger(pluginName) },
                context.plugins[pluginName] || {}
            );
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
            await pluginModule.version(
                { ...context, logger: new Logger(pluginName) },
                context.plugins[pluginName] || {}
            );
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