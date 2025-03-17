/**
 * Copyright 2020-202X Zowe Actions Contributors
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

    if (config.versionIndependent != null) {
        // Lerna doesn't support hybrid fixed/independent versioning so we handle it ourselves
        const changedPackageInfo = await utils.lernaList(true);
        const lernaJson = JSON.parse(fs.readFileSync("lerna.json", "utf-8"));
        lernaJson.version = context.version.new;
        fs.writeFileSync("lerna.json", JSON.stringify(lernaJson, null, 2) + "\n");
        for (const pkgInfo of changedPackageInfo.filter(pkgInfo => !pkgInfo.private)) {
            let versionOverride = null;
            for (const packageDir of Object.keys(context.version.overrides)) {
                if (packageDir === path.relative(context.rootDir, pkgInfo.location)) {
                    versionOverride = context.version.overrides[packageDir];
                    break;
                }
            }
            await updateIndependentVersion(context, pkgInfo as any, (versionOverride ?? context.version).new);
        }
    } else {
        await utils.lernaVersion(context.version.new);
    }

    context.changedFiles.push("package.json");
    if (!config[IS_LERNA_JSON_TEMP]) {
        context.changedFiles.push("lerna.json");
    } else {
        const oldPkgRaw = fs.readFileSync("package.json").toString();
        // Detect indentation here :yum:
        const pkgJson = JSON.parse(oldPkgRaw);
        pkgJson.version = context.version.new;
        fs.writeFileSync("package.json", JSON.stringify(pkgJson, null, 2) + "\n");
    }

    await utils.lernaPostVersion(); // Update lockfile because lerna doesn't

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
            for (const depsKey of ["dependencies", "devDependencies", "optionalDependencies"]) {
                if (packageJson[depsKey]?.[pkgInfo.name] != null) {
                    depsObj = packageJson[depsKey];
                    break;
                }
            }
            if (depsObj != null) {
                const firstSemverChar = depsObj[pkgInfo.name].charAt(0);
                depsObj[pkgInfo.name] = (/\d/.test(firstSemverChar) ? "" : firstSemverChar) + newVersion;
                fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
            }
        }
    }
}
