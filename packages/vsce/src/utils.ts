/**
 * Copyright 2020-2023 Zowe Actions Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as fs from "fs";
import * as path from "path";
import * as exec from "@actions/exec";
import { IContext, utils } from "@octorelease/core";

let usePnpm: boolean;
async function npxCmd(): Promise<string> {
    if (usePnpm == null) {
        try {
            usePnpm = await exec.exec("pnpm", ["--version"], {silent: true}) === 0 ? true : false;
        } catch (error) {
            usePnpm = false;
        }
    }
    return usePnpm ? "pnpm exec" : "npx";
}

export async function ovsxInfo(extensionName: string): Promise<Record<string, any> | undefined> {
    try {
        const cmdOutput = await exec.getExecOutput(await npxCmd(), ["ovsx", "get", extensionName, "--metadata"]);
        return JSON.parse(cmdOutput.stdout);
    } catch { /* Do nothing */ }
}

export async function ovsxPublish(context: IContext, vsixPath?: string): Promise<void> {
    const cmdArgs = ["ovsx", "publish"];
    if (vsixPath != null) {
        cmdArgs.push("--packagePath", vsixPath);
    } else if (fs.existsSync(path.join(context.rootDir, "yarn.lock"))) {
        cmdArgs.push("--yarn");
    }
    if (context.version.prerelease != null) {
        cmdArgs.push("--pre-release");
    }
    await utils.dryRunTask(context, `${await npxCmd()} ${cmdArgs.join(" ")}`, async () => {
        await exec.exec(await npxCmd(), cmdArgs);
    });
}

export async function vsceInfo(extensionName: string): Promise<Record<string, any> | undefined> {
    try {
        const cmdOutput = await exec.getExecOutput(await npxCmd(), ["vsce", "show", extensionName, "--json"]);
        return JSON.parse(cmdOutput.stdout);
    } catch { /* Do nothing */ }
}

export async function vscePackage(context: IContext): Promise<string> {
    const cmdArgs = ["vsce", "package"];
    if (fs.existsSync(path.join(context.rootDir, "yarn.lock"))) {
        cmdArgs.push("--yarn");
    }
    if (context.version.prerelease != null) {
        cmdArgs.push("--pre-release");
    }
    const cmdOutput = await exec.getExecOutput(await npxCmd(), cmdArgs);
    return cmdOutput.stdout.trim().match(/Packaged: (.*\.vsix)/)?.[1] as string;
}

export async function vscePublish(context: IContext, vsixPath?: string): Promise<void> {
    const cmdArgs = ["vsce", "publish"];
    if (vsixPath != null) {
        cmdArgs.push("--packagePath", vsixPath);
    } else if (fs.existsSync(path.join(context.rootDir, "yarn.lock"))) {
        cmdArgs.push("--yarn");
    }
    if (context.version.prerelease != null) {
        cmdArgs.push("--pre-release");
    }
    await utils.dryRunTask(context, `${await npxCmd()} ${cmdArgs.join(" ")}`, async () => {
        await exec.exec(await npxCmd(), cmdArgs);
    });
}

export async function verifyToken(tool: "ovsx" | "vsce", publisher: string): Promise<void> {
    await exec.exec(await npxCmd(), [tool, "verify-pat", publisher]);
}
