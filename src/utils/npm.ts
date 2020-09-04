import * as fs from "fs";
import * as os from "os";
import * as core from "@actions/core";
import { execAndReturnOutput, prependPkgDir } from "./core";

export function npmConfig(registry: string, scope?: string, pkgDir?: string): void {
    registry = registry.endsWith("/") ? registry : (registry + "/");
    scope = scope?.toLowerCase();

    const npmrcFile = prependPkgDir(".npmrc", pkgDir);
    const npmrcBakFile = prependPkgDir(".npmrc.bak", pkgDir);

    if (fs.existsSync(npmrcFile)) {
        fs.renameSync(npmrcFile, npmrcBakFile);
    }

    // Remove HTTP or HTTPS protocol from front of registry URL
    const authLine = registry.replace(/^\w+:/, "") + ":_authToken=" + core.getInput("npm-token");
    const registryLine = (scope ? `${scope}:` : "") + `registry=${registry}`;
    fs.writeFileSync(npmrcFile, authLine + os.EOL + registryLine + os.EOL);
}

export function npmReset(pkgDir?: string): void {
    const npmrcFile = prependPkgDir(".npmrc", pkgDir);
    const npmrcBakFile = prependPkgDir(".npmrc.bak", pkgDir);

    if (fs.existsSync(npmrcFile)) {
        fs.unlinkSync(npmrcFile);
    }

    if (fs.existsSync(npmrcBakFile)) {
        fs.renameSync(npmrcBakFile, npmrcFile);
    }
}

export async function npmVersion(newVersion: string): Promise<string> {
    const gitTag = (await execAndReturnOutput("npm", ["version", newVersion, "--allow-same-version", "--no-git-tag-version"])).trim();
    return gitTag.slice(1);
}

export async function npmViewVersion(pkgName: string, pkgTag: string): Promise<string | undefined> {
    try {
        return (await execAndReturnOutput("npm", ["view", `${pkgName}@${pkgTag}`, "version"])).trim();
    } catch {
        core.warning(`Failed to get package version for ${pkgName}@${pkgTag}`);
    }
}
