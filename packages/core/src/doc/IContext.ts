import { Logger } from "../logger";
import { IProtectedBranch } from "./IProtectedBranch";

export interface IContext {
    branch: IProtectedBranch & { tag: string };
    changedFiles: string[];
    dryRun: boolean;
    env: Record<string, string>,
    failError?: Error;
    logger: Logger;
    plugins: { [key: string]: Record<string, any> };
    releasedPackages: { [key: string]: any };
    releaseNotes?: string;
    version: { old?: string; new?: string };
    workspaces?: string[];
}
