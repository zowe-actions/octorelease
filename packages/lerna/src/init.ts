/**
 * Copyright 2020-2024 Zowe Actions Contributors
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
import { IContext } from "@octorelease/core";
import { DEFAULT_NPM_REGISTRY, utils as npmUtils } from "@octorelease/npm";
import { IPluginConfig, IS_LERNA_JSON_TEMP } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    let publishConfig;
    config[IS_LERNA_JSON_TEMP] = !fs.existsSync("lerna.json");
    if (!config[IS_LERNA_JSON_TEMP]) {
        try {
            const lernaJson = JSON.parse(fs.readFileSync("lerna.json", "utf-8"));
            context.version.new = lernaJson.version;
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
        if (config[IS_LERNA_JSON_TEMP]) {
            context.version.new = packageJson.version;
            const lernaConfig: Record<string, any> = { version: packageJson.version };
            if (fs.existsSync("pnpm-workspaces.yaml")) {
                lernaConfig.npmClient = "pnpm";
            }
            if ((await utils.getLernaMajorVersion() || 0) < 7) {
                lernaConfig.useWorkspaces = true;
            }
            fs.writeFileSync("lerna.json", JSON.stringify(lernaConfig, null, 2));
        }
    } catch {
        throw new Error(`Missing or invalid package.json in branch ${context.branch.name}`);
    }

    if (config.versionIndependent != null) {
        for (const { name, location } of await utils.lernaList()) {
            if (!config.versionIndependent.includes(name)) {
                continue;
            }
            const packageJson = JSON.parse(fs.readFileSync(path.join(location, "package.json"), "utf-8"));
            if (!packageJson.private) {
                const relPackageDir = path.relative(context.rootDir, location);
                context.version.overrides[relPackageDir] = {
                    old: packageJson.version,
                    new: packageJson.version,
                    prerelease: context.version.prerelease
                };
            }
        }
    }

    context.branch.channel = context.branch.channel || "latest";
    if (config.npmPublish === false) {
        return;
    }

    const useTokenAuth = npmUtils.verifyConditions(context);
    await npmUtils.npmConfig(context, publishConfig?.registry || DEFAULT_NPM_REGISTRY, useTokenAuth);
}
