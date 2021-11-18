export const DEFAULT_NPM_REGISTRY = "https://registry.npmjs.org/";

export interface IPluginConfig {
    aliasTags?: Record<string, string | string[]>;
    npmPublish?: boolean;
    smokeTest?: boolean;
    tarballDir?: string;
}
