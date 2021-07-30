import * as core from "@actions/core";
import * as exec from "@actions/exec";

export async function gitAdd(...files: string[]): Promise<void> {
    await exec.exec("git", ["add", ...files]);
}

export async function gitCommit(message: string, amend?: boolean): Promise<void> {
    // Check if there is anything to commit
    if (!amend) {
        const cmdOutput = (await exec.getExecOutput("git", ["diff", "--name-only", "--cached"])).stdout.trim();
        if (cmdOutput.length == 0) {
            core.warning("Nothing to commit");
            return;
        }
    }

    const cmdArgs = ["commit", "-s", "-m", `${message} [ci skip]`];
    if (amend) {
        cmdArgs.push("--amend");
    }
    await exec.exec("git", cmdArgs);
}

export function gitConfig(): void {
    core.exportVariable("GIT_COMMITTER_NAME", core.getInput("git-committer-name"));
    core.exportVariable("GIT_COMMITTER_EMAIL", core.getInput("git-committer-email"));
}

export async function gitPush(branch: string, tags?: boolean): Promise<void> {
    // Check if there is anything to push
    if (!tags) {
        const cmdOutput = (await exec.getExecOutput("git", ["cherry"])).stdout.trim();
        if (cmdOutput.length == 0) {
            core.warning("Nothing to push");
            return;
        }
    }

    const cmdArgs = ["push", "-u", "origin", branch];
    if (tags) {
        cmdArgs.push("--tags");
    }
    await exec.exec("git", cmdArgs);
}

export async function gitShow(gitHash: string, filename: string): Promise<string> {
    await exec.exec("git", ["fetch", "origin", gitHash]);
    return (await exec.getExecOutput("git", ["--no-pager", "show", `${gitHash}:${filename}`])).stdout;
}

export async function gitTag(tagName: string, message?: string): Promise<void> {
    const cmdArgs = ["tag", tagName];
    if (message != null) {
        cmdArgs.push("-a", "-m", message);
    }
    await exec.exec("git", cmdArgs);
}
