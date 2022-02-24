import { IProtectedBranch } from "./IProtectedBranch";

/**
 * Union type for branch configuration. Can be string specifying branch name
 * or object containing branch config.
 */
export type BranchConfig = string | IProtectedBranch;

/**
 * Union type for plugin configuration. Can be string specifying plugin name
 * or tuple containing plugin name and configuration object.
 */
export type PluginConfig = string | [string, Record<string, any>];

/**
 * Configuration object loaded from release config file
 */
export interface IConfig {
    /**
     * Array of protected branch configurations
     */
    branches: BranchConfig[];

    /**
     * Array of Octorelease plugin configurations
     */
    plugins: PluginConfig[];

    /**
     * Git tag prefix that precedes version number (default is "v")
     */
    tagPrefix: string;
}
