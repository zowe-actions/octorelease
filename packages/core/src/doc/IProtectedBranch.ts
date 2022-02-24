/**
 * Protected branch configuration object
 */
export interface IProtectedBranch {
    /**
     * Branch name
     */
    name: string;

    /**
     * Release channel (e.g., NPM tag)
     */
    channel?: string;

    /**
     * Maximum semver bump level allowed
     */
    level?: "major" | "minor" | "patch";

    /**
     * Prerelease name (defaults to branch name if `true`)
     */
    prerelease?: boolean | string;
}
