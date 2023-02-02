/**
 * Copyright 2022 Octorelease Contributors
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

import * as exec from "@actions/exec";

export async function lernaList(onlyChanged?: boolean): Promise<Record<string, any>[]> {
    let cmdOutput = await exec.getExecOutput("npx", ["lerna", "list", "--json", "--toposort"]);
    const packageInfo = JSON.parse(cmdOutput.stdout);

    if (onlyChanged) {
        cmdOutput = await exec.getExecOutput("npx", ["lerna", "changed", "--include-merged-tags"], { ignoreReturnCode: true });
        const changedPackages = cmdOutput.stdout.split(/\r?\n/);
        return packageInfo.filter((pkg: any) => changedPackages.includes(pkg.name));
    }

    return packageInfo;
}

export async function lernaVersion(newVersion: string): Promise<void> {
    await exec.exec("npx", ["lerna", "version", newVersion, "--exact", "--include-merged-tags", "--no-git-tag-version", "--yes"]);
    // Update subpackage versions in lockfile (requires npm@8.5 or newer)
    await exec.exec("npm", ["install", "--package-lock-only", "--ignore-scripts", "--no-audit"]);
}
