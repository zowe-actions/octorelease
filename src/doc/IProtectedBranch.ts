export interface IProtectedBranch {
    name: string;
    tag?: string;
    level?: "major" | "minor" | "patch";
    prerelease?: boolean | string;
    aliasTags?: string[];
}
