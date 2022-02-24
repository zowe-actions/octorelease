import { KnownCiEnv } from "env-ci";
import { Logger } from "../logger";
import { IProtectedBranch } from "./IProtectedBranch";

export interface IContext {
    branch: IProtectedBranch & {
        tag: string;
    };
    changedFiles: string[];
    ci: KnownCiEnv & {
        repo: {
            owner: string;
            repo: string;
        };
    };
    dryRun: boolean;
    env: Record<string, string>,
    failError?: Error;
    logger: Logger;
    plugins: { [key: string]: Record<string, any> };
    releasedPackages: { [key: string]: {
        name: string;
        url?: string;
        [key: string]: any;
    }[] };
    releaseNotes?: string;
    tagPrefix: string;
    version: {
        old: string;
        new: string;
        prerelease?: string;
    };
    workspaces?: string[];
}
