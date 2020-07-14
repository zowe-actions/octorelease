import * as fs from "fs";
import * as os from "os";
import * as core from "@actions/core";
import { execAndReturnOutput } from "./core";

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

export async function npmViewVersion(pkgName: string, pkgTag: string): Promise<string | undefined> {
    try {
        return (await execAndReturnOutput("npm", ["view", `${pkgName}@${pkgTag}`, "version"])).trim();
    } catch {
        core.warning(`Failed to get package version for ${pkgName}@${pkgTag}`);
    }
}
