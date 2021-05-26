export interface IProtectedBranch {
    name: string;
    tag?: string;
    level?: "major" | "minor" | "patch";
    prerelease?: boolean | string;
    dependencies?: string[] | { [key: string]: string };
    devDependencies?: string[] | { [key: string]: string };
    aliasTags?: string[];
}
