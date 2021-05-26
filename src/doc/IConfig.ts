import { IProtectedBranch } from "./IProtectedBranch";

export type BranchConfig = string | IProtectedBranch;

export type PublishType = "github" | "npm";

export type PublishConfig = PublishType | [PublishType, Record<string, any>];

export interface IConfig {
    branches: BranchConfig[];
    publishConfig: PublishConfig[];
}
