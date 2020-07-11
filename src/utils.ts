import * as fs from "fs";
import * as os from "os";
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

export async function getPackageVersion(pkgName: string, pkgTag: string): Promise<string | undefined> {
    try {
        return (await execAndReturnOutput("npm", ["view", `${pkgName}@${pkgTag}`, "version"])).trim();
    } catch {
        core.warning(`Failed to get package version for ${pkgName}@${pkgTag}`);
    }
}

export async function gitCommit(message: string, amend?: boolean): Promise<void> {
    const gitArgs = amend ? "--amend" : "";
    await exec.exec(`git commit ${gitArgs} -m "${message} [ci skip]" -s`);
}

export async function gitConfig(): Promise<void> {
    const gitUser = "github-actions[bot]";
    const gitEmail = "41898282+github-actions[bot]@users.noreply.github.com";
    await exec.exec(`git config --global user.name "${gitUser}"`);
    await exec.exec(`git config --global user.email "${gitEmail}"`);

    const repository: string = requireEnvVar("GITHUB_REPOSITORY");
    await exec.exec(`git remote set-url origin https://github.com/${repository}.git`);
}

export async function gitPush(branch: string, tags?: boolean): Promise<void> {
    // Check if there is anything to push
    if (!tags) {
        const cmdOutput = (await execAndReturnOutput("git", ["cherry"])).trim();
        if (cmdOutput.length == 0) {
            core.warning("Nothing to push");
            return;
        }
    }

    const gitArgs = tags ? "--tags" : "";
    await exec.exec(`git push ${gitArgs} -u origin ${branch}`);
}

export function npmConfig(registry: string, scope?: string): void {
    registry = registry.endsWith("/") ? registry : (registry + "/");
    scope = scope?.toLowerCase();

    if (fs.existsSync(".npmrc")) {
        fs.renameSync(".npmrc", ".npmrc.bak");
    }

    // Remove HTTP or HTTPS protocol from front of registry URL
    const authLine = registry.replace(/^\w+:/, "") + ":_authToken=" + core.getInput("npm-token");
    const registryLine = (scope ? `${scope}:` : "") + `registry=${registry}`;
    fs.writeFileSync(".npmrc", authLine + os.EOL + registryLine + os.EOL);
}

export function npmReset(): void {
    if (fs.existsSync(".npmrc")) {
        fs.unlinkSync(".npmrc");
    }

    if (fs.existsSync(".npmrc.bak")) {
        fs.renameSync(".npmrc.bak", ".npmrc");
    }
}

export function requireEnvVar(name: string): string {
    const value = process.env[name];
    if (value == null) {
        throw new Error(`Expected environment variable ${name} to be defined but it is not`);
    }
    return value;
}
