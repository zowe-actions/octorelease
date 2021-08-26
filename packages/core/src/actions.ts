import * as core from "@actions/core";
import { IContext, IPluginsLoaded } from "./doc";
import { Logger } from "./logger";

export async function fail(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    if (shouldSkipStage("fail")) return;
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.fail != null) {
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
            await pluginModule.init(
                { ...context, logger: new Logger(pluginName) },
                context.plugins[pluginName] || {}
            );
        }
    }
}

export async function publish(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    if (shouldSkipStage(context, "publish")) return;
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.publish != null) {
            await pluginModule.publish(
                { ...context, logger: new Logger(pluginName) },
                context.plugins[pluginName] || {}
            );
        }
    }
}

export async function success(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    if (shouldSkipStage(context, "success")) return;
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.success != null) {
            await pluginModule.success(
                { ...context, logger: new Logger(pluginName) },
                context.plugins[pluginName] || {}
            );
        }
    }
}

export async function version(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    if (shouldSkipStage(context, "version")) return;
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.version != null) {
            await pluginModule.version(
                { ...context, logger: new Logger(pluginName) },
                context.plugins[pluginName] || {}
            );
        }
    }
}

function shouldSkipStage(context: IContext, name: "fail" | "publish" | "success" | "version"): boolean {
    const shouldSkip = core.getInput("skip-stages").split(",").map(s => s.trim()).includes(name);
    if (shouldSkip) {
        context.logger.info(`Skipping "${name}" stage`);
    }
    return shouldSkip;
}
