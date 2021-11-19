import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as exec from "@actions/exec";
import { IContext, utils } from "@octorelease/core";

export async function npmAddTag(context: IContext, pkgName: string, pkgVersion: string, tag: string, registry: string, inDir?: string): Promise<void> {
    const cmdArgs = ["dist-tag", "add", `${pkgName}@${pkgVersion}`, tag, "--registry", registry];
    await utils.dryRunTask(context, `npm ${cmdArgs.join(" ")}`, async () => {
        await exec.exec("npm", cmdArgs, { cwd: inDir });
    });
}

export async function npmConfig(context: IContext, registry: string, useToken = true): Promise<void> {
    const npmrcLines: string[] = [];
    // Add trailing slash to end of registry URL and remove protocol at start
    const registrySpec = (registry.endsWith("/") ? registry : (registry + "/")).replace(/^\w+:/, "");
    if (useToken) {
        npmrcLines.push(`${registrySpec}:_authToken=${context.env.NPM_TOKEN}`);
    } else {
        const b64Auth = Buffer.from(`${context.env.NPM_USERNAME}:${context.env.NPM_PASSWORD}`).toString("base64");
        npmrcLines.push(`${registrySpec}:_auth=${b64Auth}`);
        npmrcLines.push(`${registrySpec}:email=${context.env.NPM_EMAIL}`);
    }
    fs.appendFileSync(path.join(os.homedir(), ".npmrc"), npmrcLines.join("\n"));
    await exec.exec("npm", ["whoami", "--registry", registry]);
}

export async function npmInstall(pkgSpec: string, registry: string, inDir?: string): Promise<void> {
    const registryPrefix = pkgSpec.startsWith("@") ? `${pkgSpec.split("/")[0]}:` : "";
    await exec.exec("npm", ["install", pkgSpec, `--${registryPrefix}registry=${registry}`], { cwd: inDir });
}

export async function npmPack(inDir?: string): Promise<string> {
    const cmdOutput = await exec.getExecOutput("npm", ["pack"], { cwd: inDir });
    return cmdOutput.stdout.trim();
}

export async function npmPublish(context: IContext, tag: string, registry: string, inDir?: string): Promise<void> {
    const cmdArgs = ["publish", "--tag", tag, "--registry", registry];
    if (context.dryRun) {
        cmdArgs.push("--dry-run");
    }
    await exec.exec("npm", cmdArgs, { cwd: inDir });
}

export async function npmVersion(newVersion: string): Promise<void> {
    await exec.exec("npm", ["version", newVersion, "--allow-same-version", "--no-git-tag-version"]);
}

export async function npmView(pkgSpec: string, registry: string, property?: string): Promise<any> {
    const cmdArgs = ["view", `${pkgSpec}`, "--json", "--registry", registry];
    if (property != null) {
        cmdArgs.push(property);
    }
    try {
        const cmdOutput = await exec.getExecOutput("npm", cmdArgs);
        return JSON.parse(cmdOutput.stdout.trim());
    } catch { /* Do nothing */ }
}
