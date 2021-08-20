import { IProtectedBranch } from "./IProtectedBranch";

export interface IContext {
    branch: IProtectedBranch & { tag: string };
    changedFiles: string[];
    dryRun: boolean;
    env: Record<string, string>,
    failError?: Error;
    // TODO Implement logger class that prefixes messages with plugin names
    // logger: {
    //     debug: (message: string) => void;
    //     error: (message: string) => void;
    //     info: (message: string) => void;
    //     warning: (message: string) => void; 
    // };
    plugins: { [key: string]: Record<string, any> };
    releaseNotes?: string;
    version: { old?: string; new?: string };
    workspaces?: string[];
}
