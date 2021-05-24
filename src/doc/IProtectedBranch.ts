export interface IProtectedBranch {
    name: string;
    tag?: string;
    level?: "major" | "minor" | "patch";
    prerelease?: boolean | string;
    dependencies?: string[] | Record<string, string>;
    devDependencies?: string[] | Record<string, string>;
    aliasTags?: string[];
}
