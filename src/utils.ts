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
    await exec.exec(`git commit -m "${message} [ci skip]" -s`);
}

export async function gitConfig(): Promise<void> {
    // const gitUser = "zowe-robot";
    // const gitEmail = "zowe.robot@gmail.com";
    let gitUser = "Timothy Johnson";
    const gitEmail = "timothy.johnson@broadcom.com";

    await exec.exec(`git config --global user.name "${gitUser}"`);
    await exec.exec(`git config --global user.email "${gitEmail}"`);

    // const gitUser = "zowe-robot";
    gitUser = "tjohnsonBCM";
    const authToken: string = core.getInput("repo-token");
    const repository: string = requireEnvVar("GITHUB_REPOSITORY");
    await exec.exec(`git remote set-url origin https://${gitUser}:${authToken}@github.com/${repository}.git`);
}

export async function gitPush(branch: string, tags?: boolean): Promise<void> {
    // Check if there is anything to push
    const cmdOutput = (await execAndReturnOutput("git", ["cherry"])).trim();
    if (cmdOutput.length == 0) {
        return;
    }

    await exec.exec(`git push origin ${branch} ${tags ? "--tags" : ""}`);
}

export function requireEnvVar(name: string): string {
    const value = process.env[name];
    if (value == null) {
        throw new Error(`Expected environment variable ${name} to be defined but it is not`);
    }
    return value;
}
