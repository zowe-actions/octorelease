import * as fs from "fs";
import * as os from "os";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { IContext } from "../../doc";

export async function npmAddTag(pkgName: string, pkgVersion: string, tag: string, inDir?: string): Promise<void> {
    await exec.exec("npm", ["dist-tag", "add", `${pkgName}@${pkgVersion}`, tag], { cwd: inDir });
}

export function npmConfig(context: IContext, registry: string, scope?: string): void {
    registry = registry.endsWith("/") ? registry : (registry + "/");
    scope = scope?.toLowerCase();

    if (fs.existsSync(".npmrc")) {
        fs.renameSync(".npmrc", ".npmrc.bak");
    }

    // Remove HTTP or HTTPS protocol from front of registry URL
    const authLine = registry.replace(/^\w+:/, "") + ":_authToken=" + context.env.NPM_TOKEN;
    const registryLine = (scope ? `${scope}:` : "") + `registry=${registry}`;
    fs.writeFileSync(".npmrc", authLine + os.EOL + registryLine + os.EOL);
}

export async function npmPack(inDir?: string): Promise<string> {
    const cmdOutput = await exec.getExecOutput("npm", ["pack"], { cwd: inDir });
    return cmdOutput.stdout.trim();
}

export async function npmPublish(tag: string, inDir?: string): Promise<void> {
    await exec.exec("npm", ["publish", "--tag", tag], { cwd: inDir });
}

export function npmReset(): void {
    if (fs.existsSync(".npmrc")) {
        fs.unlinkSync(".npmrc");
    }

    if (fs.existsSync(".npmrc.bak")) {
        fs.renameSync(".npmrc.bak", ".npmrc");
    }
}

export async function npmVersion(newVersion: string): Promise<void> {
    await exec.exec("npm", ["version", newVersion, "--allow-same-version", "--no-git-tag-version"]);
}

export async function npmViewVersion(pkgName: string, pkgTag: string): Promise<string | undefined> {
    try {
        return (await exec.getExecOutput("npm", ["view", `${pkgName}@${pkgTag}`, "version"])).stdout.trim();
    } catch {
        core.warning(`Failed to get package version for ${pkgName}@${pkgTag}`);
    }
}
