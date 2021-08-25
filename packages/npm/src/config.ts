export interface IPluginConfig {
    aliasTags?: Record<string, string | string[]>;
    npmPublish?: boolean;
    smokeTest?: boolean;
    tarballDir?: string;
}
