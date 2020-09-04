import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { execAndReturnOutput, requireEnvVar } from "./core";

export async function gitCommit(message: string, amend?: boolean): Promise<void> {
    // Check if there is anything to commit
    if (!amend) {
        const cmdOutput = (await execAndReturnOutput("git diff --name-only --cached")).trim();
        if (cmdOutput.length == 0) {
            core.warning("Nothing to commit");
            return;
        }
    }

    const gitArgs = amend ? "--amend" : "";
    await exec.exec(`git commit ${gitArgs} -m "${message} [ci skip]" -s`);
}

export async function gitConfig(): Promise<void> {
    const gitUser = "github-actions[bot]";
    const gitEmail = "41898282+github-actions[bot]@users.noreply.github.com";
    await exec.exec(`git config --global user.name "${gitUser}"`);
    await exec.exec(`git config --global user.email "${gitEmail}"`);

    const repository: string = requireEnvVar("GITHUB_REPOSITORY");
    const repoToken: string = core.getInput("repo-token");
    await exec.exec(`git remote set-url origin https://${repoToken}@github.com/${repository}.git`);
}

export async function gitPush(branch: string, tags?: boolean): Promise<void> {
    // Check if there is anything to push
    if (!tags) {
        const cmdOutput = (await execAndReturnOutput("git cherry")).trim();
        if (cmdOutput.length == 0) {
            core.warning("Nothing to push");
            return;
        }
    }

    const gitArgs = tags ? "--tags" : "";
    await exec.exec(`git push ${gitArgs} -u origin ${branch}`);
}
