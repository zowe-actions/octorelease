export const DEFAULT_RELEASE_LABELS = ["release-none", "release-patch", "release-minor", "release-major"];

export interface IPluginConfig {
    assets?: string | string[];
    checkPrLabels?: boolean | [string, string, string, string];
    githubUrl?: string;
}
