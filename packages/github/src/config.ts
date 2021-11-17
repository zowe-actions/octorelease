export const DEFAULT_RELEASE_LABELS = ["no-release", "release-patch", "release-minor", "release-major"];

export interface IPluginConfig {
    assets?: string | string[];
    checkPrLabels?: boolean | [string, string, string, string];
}
