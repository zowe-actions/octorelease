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
    const ciSkipPhrase = core.getInput("ciSkipPhrase");
    await exec.exec(`git commit -m "${message} [${ciSkipPhrase}]" -s`);
}

export function requireEnvVar(name: string): string {
    const value = process.env[name];
    if (value == null) {
        throw new Error(`Expected environment variable ${name} to be defined but it is not`);
    }
    return value;
}
