import * as core from "@actions/core";
import { IContext, IPluginsLoaded } from "./doc";
import { Inputs } from "./inputs";
import { Logger } from "./logger";

export async function fail(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    if (shouldSkipStage("fail")) return;
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.fail != null) {
            context.logger.info(`Running "fail" action for plugin ${pluginName}`);
            await pluginModule.fail(
                { ...context, logger: new Logger(pluginName) },
                context.plugins[pluginName] || {}
            );
        }
    }
}

export async function init(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    // Init stage is not skippable
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.init != null) {
            context.logger.info(`Running "init" action for plugin ${pluginName}`);
            await pluginModule.init(
                { ...context, logger: new Logger(pluginName) },
                context.plugins[pluginName] || {}
            );
        }
    }
}

export async function publish(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    if (shouldSkipStage("publish")) return;
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.publish != null) {
            context.logger.info(`Running "publish" action for plugin ${pluginName}`);
            await pluginModule.publish(
                { ...context, logger: new Logger(pluginName) },
                context.plugins[pluginName] || {}
            );
        }
    }
}

export async function success(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    if (shouldSkipStage("success")) return;
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.success != null) {
            context.logger.info(`Running "success" action for plugin ${pluginName}`);
            await pluginModule.success(
                { ...context, logger: new Logger(pluginName) },
                context.plugins[pluginName] || {}
            );
        }
    }
}

export async function version(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    if (shouldSkipStage("version")) return;
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.version != null) {
            context.logger.info(`Running "version" action for plugin ${pluginName}`);
            await pluginModule.version(
                { ...context, logger: new Logger(pluginName) },
                context.plugins[pluginName] || {}
            );
        }
    }
}

function shouldSkipStage(name: "fail" | "publish" | "success" | "version"): boolean {
    if (Inputs.skipStages.includes(name)) {
        core.info(`Skipping "${name}" stage`);
        return true;
    }
    return false;
}
