/**
 * Info about project version
 */
export interface IVersionInfo {
    /**
     * Old version found in Git history
     */
    old: string;

    /**
     * New version to be released
     */
    new: string;

    /**
     * Prerelease string if this is a prerelease branch
     */
    prerelease?: string;
}
