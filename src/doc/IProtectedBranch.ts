export interface IProtectedBranch {
    name: string;
    dependencies?: { [key: string]: string };
    devDependencies?: { [key: string]: string };
    level?: "major" | "minor" | "patch";
    tag: string;
    aliasTags?: string[];
}
