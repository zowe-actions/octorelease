import * as exec from "@actions/exec";
import { IContext } from "@octorelease/core";

export async function gitAdd(...files: string[]): Promise<void> {
    await exec.exec("git", ["add", ...files]);
}

export async function gitCommit(message: string, amend?: boolean): Promise<boolean> {
    // Check if there is anything to commit
    if (!amend) {
        const cmdOutput = await exec.getExecOutput("git", ["diff", "--name-only", "--cached"]);
        if (cmdOutput.stdout.trim().length == 0) {
            return false;
        }
    }

    const cmdArgs = ["commit", "-s", "-m", `${message} [ci skip]`];
    if (amend) {
        cmdArgs.push("--amend");
    }
    await exec.exec("git", cmdArgs);
    return true;
}

export async function gitConfig(context: IContext): Promise<void> {
    await exec.exec("git", ["config", "--global", "user.name", context.env.GIT_COMMITTER_NAME]);
    await exec.exec("git", ["config", "--global", "user.email", context.env.GIT_COMMITTER_EMAIL]);
}

export async function gitPush(context: IContext, branch: string, tags?: boolean): Promise<boolean> {
    // Check if there is anything to push
    if (!tags) {
        const cmdOutput = await exec.getExecOutput("git", ["cherry"]);
        if (cmdOutput.stdout.trim().length == 0) {
            return false;
        }
    }

    const cmdArgs = ["push", "-u", "origin", branch];
    if (tags) {
        cmdArgs.push("--follow-tags");
    }
    if (context.dryRun) {
        cmdArgs.push("--dry-run");
    }
    await exec.exec("git", cmdArgs);
    return true;
}

export async function gitTag(tagName: string, message?: string): Promise<void> {
    const cmdArgs = ["tag", tagName];
    if (message != null) {
        cmdArgs.push("-a", "-m", message);
    }
    await exec.exec("git", cmdArgs);
}
