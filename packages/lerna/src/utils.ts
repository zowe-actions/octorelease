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
import * as exec from "@actions/exec";

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

export async function getLernaMajorVersion(): Promise<number> {
    // If using lerna lite, the version is "unknown" so this function will return NaN
    const cmdOutput = await exec.getExecOutput(await npxCmd(), ["lerna", "--version"]);
    return parseInt(cmdOutput.stdout.split(".", 1)[0]);
}

export async function lernaList(onlyChanged?: boolean): Promise<Record<string, any>[]> {
    const cmdArgs = ["lerna"];
    if (onlyChanged) {
        cmdArgs.push("changed", "--include-merged-tags");
    } else {
        cmdArgs.push("list");
    }
    cmdArgs.push("--all", "--json", "--toposort");
    const cmdOutput = await exec.getExecOutput("npx", cmdArgs, { ignoreReturnCode: onlyChanged });
    return cmdOutput.exitCode === 0 ? JSON.parse(cmdOutput.stdout) : [];
}

export async function lernaVersion(newVersion: string, excludeDirs?: string[]): Promise<void> {
    const cmdArgs = ["--exact", "--include-merged-tags", "--no-git-tag-version", "--yes"];
    if (excludeDirs) {
        cmdArgs.push("--ignore-changes", ...excludeDirs.map(dir => dir + "/**"));
    }
    await exec.exec(await npxCmd(), ["lerna", "version", newVersion, ...cmdArgs]);
}

export async function lernaPostVersion(): Promise<void> {
    if (!fs.existsSync("yarn.lock") && !usePnpm) {
        // Update subpackage versions in lockfile (requires npm@8.5 or newer)
        await exec.exec("npm", ["install", "--package-lock-only", "--ignore-scripts", "--no-audit"]);
    } else if (usePnpm) {
        await exec.exec("pnpm", ["install", "--lockfile-only", "--ignore-scripts"]);
    }
}
