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
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { IContext, IProtectedBranch } from "@octorelease/core";
import { utils as gitUtils } from "@octorelease/git";

const lockfilePath = fs.existsSync("npm-shrinkwrap.json") ? "npm-shrinkwrap.json" : "package-lock.json";
const updateDetails: string[] = [];
let resolutions: Record<string, string> = {};

interface IProtectedBranchWithDeps extends IProtectedBranch {
    dependencies: string[] | Record<string, string | string[]>;
    devDependencies: string[] | Record<string, string | string[]>;
}

function getDependencies(context: IContext, branch: IProtectedBranchWithDeps, dev: boolean) {
    context.logger.debug(`Gathering ${dev ? "devD" : "d"}ependency information for branch: ${branch.name}`);
    const dependencies = dev ? branch.devDependencies : branch.dependencies;
    if (!Array.isArray(dependencies)) {
        return dependencies || {};
    }

    const dependencyMap: { [key: string]: string } = {};
    for (const pkgName of dependencies) {
        dependencyMap[pkgName] = branch.channel || "latest";
    }

    return dependencyMap;
}

async function updateDependency(context: IContext, pkgName: string, pkgTag: string | string[], dev: boolean): Promise<void> {
    let tempPkgTag = "";
    let moreRgs: string[] = [];
    const env: { [key: string]: string } = { ...process.env as any } // ?
    if (!Array.isArray(pkgTag)) {
        tempPkgTag = pkgTag;
    } else {
        tempPkgTag = pkgTag.shift() ?? "";
        moreRgs = pkgTag;
        for (const reg of moreRgs) {
            const propKey = "NPM_CONFIG_" + reg.split("=")[0].toUpperCase();
            env[propKey] = reg.split("=")[1];
        }
    }

    context.logger.debug(`Updating ${dev ? "devD" : "d"}ependency for: ${pkgName}@${tempPkgTag}`);
    const cmdOutput = (await exec.getExecOutput("npm", ["list", pkgName, "--json", "--depth", "0"], { env })).stdout;
    const currentVersion = JSON.parse(cmdOutput).dependencies[pkgName].version;

    if (resolutions[pkgName] == null) {
        context.logger.debug(`Gathering version information for: ${pkgName}@${tempPkgTag}`);
        resolutions[pkgName] = (await exec.getExecOutput("npm",
            ["view", `${pkgName}@${tempPkgTag}`, "version"], { env })).stdout.trim();
    }
    const latestVersion = resolutions[pkgName];

    if (currentVersion !== latestVersion) {
        const npmArgs = dev ? ["--save-dev"] : ["--save-prod", "--save-exact"];
        const newUpdate = `${pkgName}: ${currentVersion} -> ${latestVersion}`;
        context.logger.debug(`Updating ${newUpdate}`);
        await exec.exec("npm", ["install", `${pkgName}@${latestVersion}`, ...npmArgs], { env });
        updateDetails.push(newUpdate);
    }
}

export default async function (context: IContext): Promise<void> {
    const branchConfig = context.branch as IProtectedBranchWithDeps;
    if (branchConfig.dependencies == null && branchConfig.devDependencies == null) {
        return;
    }

    const pluralize = require("pluralize");
    const dependencies = getDependencies(context, branchConfig, false);
    const devDependencies = getDependencies(context, branchConfig, true);
    const changedFiles = ["package.json", lockfilePath];
    context.logger.info(`Checking for updates to ${pluralize("dependency", Object.keys(dependencies).length, true)} ` +
        `and ${pluralize("dev dependency", Object.keys(devDependencies).length, true)}`);

    if (context.env.NPM_RESOLUTIONS) {
        resolutions = JSON.parse(context.env.NPM_RESOLUTIONS);
        if (Object.keys(resolutions).length === 0) {
            context.logger.debug("No NPM resolutions found, exiting now");
            return;
        }
    }

    if (branchConfig.dependencies != null) {
        for (const [pkgName, pkgTag] of Object.entries(dependencies)) {
            await updateDependency(context, pkgName, pkgTag, false);
        }
    }

    if (branchConfig.devDependencies) {
        for (const [pkgName, pkgTag] of Object.entries(devDependencies)) {
            await updateDependency(context, pkgName, pkgTag, true);
        }
    }

    if (!context.env.NPM_RESOLUTIONS) {
        core.setOutput("result", JSON.stringify(resolutions));
    }

    if (updateDetails.length > 0) {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        if (packageJson.workspaces != null) {
            changedFiles.push("**/package.json");
            const dependencyList = [...Object.keys(dependencies), ...Object.keys(devDependencies)];

            await exec.exec("npx", ["-y", "--", "syncpack", "fix-mismatches", "--dev", "--prod", "--filter",
                dependencyList.join("|")]);
            await exec.exec("git", ["checkout", lockfilePath]);
            await exec.exec("npm", ["install"]);
        }

        if (context.env.GIT_COMMITTER_NAME !== null && context.env.GIT_COMMITTER_EMAIL !== null) {
            await gitUtils.gitConfig(context);
            await gitUtils.gitAdd(...changedFiles);
            await gitUtils.gitCommit("Update dependencies [ci skip]\n\n" + updateDetails.join("\n"));
        }
    }
}
