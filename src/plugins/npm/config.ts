export interface IPluginConfig {
    aliasTags?: Record<string, string | string[]>;
    npmPublish?: boolean;
    tarballDir?: string;
}
