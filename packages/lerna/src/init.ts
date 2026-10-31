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

import * as fs from "node:fs";
import * as path from "node:path";
import type { IContext } from "@octorelease/core";
import { DEFAULT_NPM_REGISTRY, utils as npmUtils } from "@octorelease/npm";
import type { IPluginConfig } from "./config";
import { LernaState } from "./state";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    const state = LernaState.get(config);
    state.workspacePackages = undefined;
    if (config.packageTagFormat != null && config.versionIndependent !== true) {
        throw new Error("packageTagFormat requires versionIndependent: true");
    }
    if (config.versionIndependent === true) {
        context.packageReleases = [];
    }
    let publishConfig: Record<string, any> | undefined;
    state.isLernaJsonTemp = !fs.existsSync("lerna.json");
    if (!state.isLernaJsonTemp) {
        try {
            const lernaJson = JSON.parse(fs.readFileSync("lerna.json", "utf-8"));
            if (config.versionIndependent !== true) {
                context.version.new = lernaJson.version;
            }
            publishConfig = lernaJson.command?.publish;
        } catch {
            throw new Error(`Missing or invalid lerna.json in branch ${context.branch.name}`);
        }
    }

    try {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        context.workspaces = packageJson.workspaces;
        if (publishConfig == null) {
            publishConfig = packageJson.publishConfig;
        }
        if (state.isLernaJsonTemp) {
            if (config.versionIndependent !== true) {
                context.version.new = packageJson.version ?? context.version.new;
            }
            const lernaConfig: Record<string, any> = {
                version: config.versionIndependent === true ? "independent" : context.version.new,
            };
            if (fs.existsSync("pnpm-workspaces.yaml")) {
                lernaConfig.npmClient = "pnpm";
            }
            if (((await utils.getLernaMajorVersion()) || 0) < 7) {
                lernaConfig.useWorkspaces = true;
            }
            context.logger.debug("Writing lerna.json with contents: " + JSON.stringify(lernaConfig));
            fs.writeFileSync("lerna.json", JSON.stringify(lernaConfig, null, 2));
        }
    } catch {
        throw new Error(`Missing or invalid package.json in branch ${context.branch.name}`);
    }

    const pkgInfo = await utils.lernaList();
    if (pkgInfo.length === 0) {
        throw new Error("No packages found in workspace, check the 'workspaces' configuration in package.json");
    }
    state.workspacePackages = pkgInfo.map(({ name, location }) => ({ name, location }));
    if (Array.isArray(config.versionIndependent)) {
        for (const { name, location } of pkgInfo) {
            if (!config.versionIndependent.includes(name)) {
                continue;
            }
            const packageJson = JSON.parse(fs.readFileSync(path.join(location, "package.json"), "utf-8"));
            if (!packageJson.private) {
                const relPackageDir = path.relative(context.rootDir, location);
                context.version.overrides[relPackageDir] = {
                    old: packageJson.version,
                    new: packageJson.version,
                    prerelease: context.version.prerelease,
                };
            }
        }
    }

    context.branch.channel = context.branch.channel || "latest";
    if (config.npmPublish === false) {
        return;
    }

    const npmRegistry = config.publishRegistry || publishConfig?.registry || DEFAULT_NPM_REGISTRY;
    const useTokenAuth = npmUtils.verifyConditions(context);
    await npmUtils.npmConfig(context, npmRegistry, useTokenAuth);
}
