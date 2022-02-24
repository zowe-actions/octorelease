import { IPlugin } from "./IPlugin";

/**
 * Contains key-value pairs of plugin names and loaded modules
 */
export interface IPluginsLoaded {
    [key: string]: IPlugin;
}
