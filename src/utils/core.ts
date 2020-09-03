import * as path from "path";
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

export async function execInDir(command: string, cwd?: string): Promise<void> {
    const options = (cwd != null) ? { cwd: path.resolve(cwd) } : undefined;
    await exec.exec(command, undefined, options);
}

export function prependPkgDir(filePath: string, pkgDir?: string): string {
    return (pkgDir != null) ? path.join(pkgDir, filePath) : filePath;
}

export function requireEnvVar(name: string): string {
    const value = process.env[name];
    if (value == null) {
        throw new Error(`Expected environment variable ${name} to be defined but it is not`);
    }
    return value;
}
