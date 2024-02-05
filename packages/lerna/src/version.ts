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
import findUp from "find-up";
import * as glob from "@actions/glob";
import { IContext } from "@octorelease/core";
import { utils as npmUtils } from "@octorelease/npm";
import { IPluginConfig, IS_LERNA_JSON_TEMP } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.version.old === context.version.new) {
        context.logger.info("Version in lerna.json is already up to date");
        return;
    }

    const changedPackageInfo = await utils.lernaList(true);
    await utils.lernaVersion(context.version.new);
    if (config.versionIndependent != null) {
        // Lerna's ignoreChanges option doesn't behave the way we want. Even if
        // we tell it to ignore a package directory, it will still bump that
        // package's version if a dependency of that package has changed. For
        // independent versioning, we let Lerna bump all the versions it wants
        // first and correct the versions of independent packages afterwards.
        for (const [packageDir, versionInfo] of Object.entries(context.version.overrides)) {
            const pkgInfo = changedPackageInfo
                .find(pkgInfo => path.relative(context.rootDir, pkgInfo.location) === packageDir);
            if (pkgInfo != null) {
                await updateIndependentVersion(context, pkgInfo as any, versionInfo.new);
            }
        }
    }

    await utils.lernaPostVersion(); // Update lockfile because lerna doesn't
    context.changedFiles.push("package.json");
    if (!config[IS_LERNA_JSON_TEMP]) {
        context.changedFiles.push("lerna.json");
    }
    const lockfilePath = await findUp(["pnpm-lock.yaml", "yarn.lock", "npm-shrinkwrap.json", "package-lock.json"]);
    if (lockfilePath != null) {
        context.changedFiles.push(path.relative(context.rootDir, lockfilePath));
    } else {
        context.logger.warn("Could not find lockfile to update version in");
    }
    for (const { location } of await utils.lernaList(false)) {
        const relLocation = path.relative(context.rootDir, location);
        context.changedFiles.push(path.join(relLocation, "package.json"));
    }
}

async function updateIndependentVersion(context: IContext, pkgInfo: { name: string, location: string },
    newVersion: string) {
    await npmUtils.npmVersion(newVersion, pkgInfo.location);
    if (context.workspaces != null) {
        const globber = await glob.create(context.workspaces.join("\n"), { implicitDescendants: false });
        for (const packageDir of [context.rootDir, ...await globber.glob()]) {
            const packageJsonPath = path.join(packageDir, "package.json");
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
            let depsObj: Record<string, string> | undefined = undefined;
            if (packageJson.dependencies?.[pkgInfo.name] != null) {
                depsObj = packageJson.dependencies;
            } else if (packageJson.devDependencies?.[pkgInfo.name] != null) {
                depsObj = packageJson.devDependencies;
            }
            if (depsObj != null) {
                const firstSemverChar = depsObj[pkgInfo.name].charAt(0);
                depsObj[pkgInfo.name] = (/\d/.test(firstSemverChar) ? "" : firstSemverChar) + newVersion;
                fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
            }
        }
    }
}
