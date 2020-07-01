import * as core from "@actions/core";
import * as exec from "@actions/exec";

export async function execAndReturnOutput(commandLine: string, args?: string[]): Promise<string> {
    let capturedOutput = "";
    const options = {
        listeners: {
            stdout: (data: Buffer) => {
                capturedOutput += data.toString();
            }
        }
    };
    await exec.exec(commandLine, args, options);
    return capturedOutput;
}

export async function gitCommit(message: string): Promise<void> {
    // const gitUser = "zowe-robot";
    // const gitEmail = "zowe.robot@gmail.com";
    const gitUser = "Timothy Johnson";
    const gitEmail = "timothy.johnson@broadcom.com";
    const ciSkipPhrase = core.getInput("ci-skip-phrase");

    await exec.exec(`git config --global user.name "${gitUser}"`);
    await exec.exec(`git config --global user.email "${gitEmail}"`);
    await exec.exec(`git commit -m "${message} [${ciSkipPhrase}]" -s`);
}

export async function gitPush(branch: string): Promise<void> {
    // Check if there is anything to push
    const cmdOutput = (await execAndReturnOutput("git", ["cherry"])).trim();
    if (cmdOutput.length == 0) {
        return;
    }

    // const gitUser = "zowe-robot";
    const gitUser = "tjohnsonBCM";
    const authToken: string = core.getInput("repo-token");
    const repository: string = requireEnvVar("GITHUB_REPOSITORY");
    await exec.exec(`git remote set-url origin https://${gitUser}:${authToken}@github.com/${repository}.git`);
    await exec.exec(`git push -u origin ${branch}`);
}

export function requireEnvVar(name: string): string {
    const value = process.env[name];
    if (value == null) {
        throw new Error(`Expected environment variable ${name} to be defined but it is not`);
    }
    return value;
}
