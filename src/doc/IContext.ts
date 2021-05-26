import { PublishType } from "./IConfig";
import { IProtectedBranch } from "./IProtectedBranch";

export interface IContext {
    branch: IProtectedBranch & { tag: string };
    eventData: any;
    git: {
        commitSha: string,
        committer: { name: string, email: string },
        repository: { owner: string, repo: string }
    };
    isMonorepo: boolean;
    publishConfig: { [key in PublishType]: Record<string, any> };
}
