export interface IProtectedBranch {
    name: string;
    channel?: string;
    level?: "major" | "minor" | "patch";
    prerelease?: boolean | string;
}
