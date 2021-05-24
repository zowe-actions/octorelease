import { IProtectedBranch } from "./IProtectedBranch";

export type PublishType = "github" | "lerna" | "npm";

export interface IConfig {
    branches: IProtectedBranch[];
    publishConfig: PublishType[];
}
