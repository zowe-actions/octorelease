import { IConfig } from "./IConfig";
import { IProtectedBranch } from "./IProtectedBranch";

export interface IContext {
    branch: IProtectedBranch & { tag: string };
    committer: { name: string, email: string };
    config: IConfig;
    eventData: any;
    github: { sha: string, token: string };
    repository: { owner: string, repo: string };
}
