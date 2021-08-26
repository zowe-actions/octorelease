import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as exec from "@actions/exec";
import { IContext } from "@octorelease/core";

export async function npmAddTag(pkgName: string, pkgVersion: string, tag: string, registry: string, inDir?: string): Promise<void> {
    await exec.exec("npm", ["dist-tag", "add", `${pkgName}@${pkgVersion}`, tag, "--registry", registry], { cwd: inDir });
}

export async function npmConfig(context: IContext, registry: string): Promise<void> {
    // Add trailing slash to end of registry URL and remove protocol at start
    registry = registry.endsWith("/") ? registry : (registry + "/");
    const authLine = registry.replace(/^\w+:/, "") + ":_authToken=" + context.env.NPM_TOKEN;
    fs.appendFileSync(path.join(os.homedir(), ".npmrc"), authLine);
    await exec.exec("npm", ["whoami", "--registry", registry]);
}

export async function npmInstall(pkgName: string, pkgVersion: string, registry: string, inDir?: string): Promise<void> {
    const registrySpec = pkgName.startsWith("@") ? `${pkgName.split("/")[0]}:registry` : "registry";
    await exec.exec("npm", ["install", `${pkgName}@${pkgVersion}`, `--${registrySpec}`, registry], { cwd: inDir });
}

export async function npmPack(inDir?: string): Promise<string> {
    const cmdOutput = await exec.getExecOutput("npm", ["pack"], { cwd: inDir });
    return cmdOutput.stdout.trim();
}

export async function npmPublish(tag: string, registry: string, inDir?: string): Promise<void> {
    await exec.exec("npm", ["publish", "--tag", tag, "--registry", registry], { cwd: inDir });
}

export async function npmVersion(newVersion: string): Promise<void> {
    await exec.exec("npm", ["version", newVersion, "--allow-same-version", "--no-git-tag-version"]);
}

export async function npmView(pkgSpec: string, property?: string): Promise<any> {
    const cmdArgs = ["view", `${pkgSpec}`, "--json"];
    if (property != null) {
        cmdArgs.push(property);
    }
    try {
        const cmdOutput = await exec.getExecOutput("npm", cmdArgs);
        return JSON.parse(cmdOutput.stdout.trim());
    } catch { /* Do nothing */ }
}
