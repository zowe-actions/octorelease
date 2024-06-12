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
import { IContext } from "@octorelease/core";
import { DEFAULT_NPM_REGISTRY, IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    let publishConfig;
    try {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        publishConfig = packageJson.publishConfig;

        if (context.workspaces == null) {
            context.version.new = packageJson.version;
        } else {
            context.logger.warn("Ignoring package.json version in workspaces");
        }
    } catch {
        throw new Error(`Missing or invalid package.json in branch ${context.branch.name}`);
    }

    if (config.pruneShrinkwrap && !fs.existsSync("npm-shrinkwrap.json")) {
        throw new Error("Could not find npm-shrinkwrap.json but the pruneShrinkwrap option was specified");
    }

    context.branch.channel = context.branch.channel || "latest";
    if (config.npmPublish === false) {
        return;
    }

    const useTokenAuth = utils.verifyConditions(context);
    await utils.npmConfig(context, publishConfig?.registry || DEFAULT_NPM_REGISTRY, useTokenAuth);
}
