import { IProtectedBranch } from "./IProtectedBranch";

export type BranchConfig = string | IProtectedBranch;

export type PluginConfig = string | [string, Record<string, any>];

export interface IConfig {
    branches: BranchConfig[];
    plugins: PluginConfig[];
    tagPrefix: string;
}
