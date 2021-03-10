import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import * as exec from "@actions/exec";

export async function execAndReturnOutput(commandLine: string, args?: string[], cwd?: string): Promise<string> {
    let capturedOutput = "";
    const options = {
        cwd: (cwd != null) ? path.resolve(cwd) : undefined,
        listeners: {
            stdout: (data: Buffer) => {
                capturedOutput += data.toString();
            }
        }
    };
    await exec.exec(commandLine, args, options);
    return capturedOutput;
}

export async function execBashCmd(command: string): Promise<void> {
    if (command) {
        await exec.exec("bash", ["-c", command]);
    }
}

export function exitIfCiSkip(ciSkipPhrase: string): void {
    const eventPath: string = requireEnvVar("GITHUB_EVENT_PATH");
    const eventData = JSON.parse(fs.readFileSync(eventPath).toString());

    // Check for CI skip
    if (eventData?.head_commit?.message && eventData.head_commit.message.indexOf(ciSkipPhrase) !== -1) {
        core.info("Commit message contains CI skip phrase so exiting now");
        process.exit();
    }
}

export function requireEnvVar(name: string): string {
    const value = process.env[name];
    if (value == null) {
        throw new Error(`Expected environment variable ${name} to be defined but it is not`);
    }
    return value;
}
