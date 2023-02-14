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
import { IContext } from "@octorelease/core";
import { DEFAULT_NPM_REGISTRY, utils as npmUtils } from "@octorelease/npm";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    let publishConfig;
    try {
        const lernaJson = JSON.parse(fs.readFileSync("lerna.json", "utf-8"));
        context.version.new = lernaJson.version;
        publishConfig = lernaJson.command?.publish;
    } catch {
        throw new Error(`Missing or invalid lerna.json in branch ${context.branch.name}`);
    }

    try {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        context.workspaces = packageJson.workspaces;
        if (publishConfig == null) {
            publishConfig = packageJson.publishConfig;
        }
    } catch {
        throw new Error(`Missing or invalid package.json in branch ${context.branch.name}`);
    }

    context.branch.channel = context.branch.channel || "latest";
    if (config.npmPublish === false) {
        return;
    }

    const useTokenAuth = npmUtils.verifyConditions(context);
    await npmUtils.npmConfig(context, publishConfig?.registry || DEFAULT_NPM_REGISTRY, useTokenAuth);
}
