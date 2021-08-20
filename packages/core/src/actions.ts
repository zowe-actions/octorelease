import { IContext, IPluginsLoaded } from "./doc";

export async function fail(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.fail != null) {
            await pluginModule.fail(context, context.plugins[pluginName] || {});
        }
    }
}

export async function init(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.init != null) {
            await pluginModule.init(context, context.plugins[pluginName] || {});
        }
    }
}

export async function publish(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.publish != null) {
            await pluginModule.publish(context, context.plugins[pluginName] || {});
        }
    }
}

export async function success(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.success != null) {
            await pluginModule.success(context, context.plugins[pluginName] || {});
        }
    }
}

export async function version(context: IContext, pluginsLoaded: IPluginsLoaded): Promise<void> {
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
        if (pluginModule.version != null) {
            await pluginModule.version(context, context.plugins[pluginName] || {});
        }
    }
}
