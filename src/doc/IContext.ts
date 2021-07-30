import { PublishType } from "./IConfig";
import { IProtectedBranch } from "./IProtectedBranch";

export interface IContext {
    branch: IProtectedBranch & { tag: string };
    isMonorepo: boolean;
    publishConfig: { [key in PublishType]: Record<string, any> };
}
