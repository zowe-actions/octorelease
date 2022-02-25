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

import * as fs from "fs";
import { IContext } from "@octorelease/core";
import { DEFAULT_NPM_REGISTRY, IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, _config: IPluginConfig): Promise<void> {
    const useToken = context.env.NPM_USERNAME == null && context.env.NPM_PASSWORD == null && context.env.NPM_EMAIL == null;
    if (useToken && context.env.NPM_TOKEN == null) {
        throw new Error("Required environment variable NPM_TOKEN is undefined");
    } else if (!useToken) {
        const missingEnvVars = ["NPM_USERNAME", "NPM_PASSWORD", "NPM_EMAIL"].filter(name => context.env[name] == null);
        if (missingEnvVars.length == 1) {
            throw new Error(`Required environment variable ${missingEnvVars[0]} is undefined`);
        } else if (missingEnvVars.length > 1) {
            throw new Error(`Required environment variables ${missingEnvVars.join(", ")} are undefined`);
        }
    }

    let publishConfig;
    try {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        context.version.new = packageJson.version;
        publishConfig = packageJson.publishConfig;
    } catch {
        context.logger.warning(`Missing or invalid package.json in branch ${context.branch.name}`);
    }

    context.branch.channel = context.branch.channel || "latest";
    await utils.npmConfig(context, publishConfig?.registry || DEFAULT_NPM_REGISTRY, useToken);
}
