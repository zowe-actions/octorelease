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

import * as github from "@actions/github";
import { GitHub, getOctokitOptions } from "@actions/github/lib/utils";
import { enterpriseServer30 } from "@octokit/plugin-enterprise-server";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";

export function getOctokit(context: IContext, config: IPluginConfig): InstanceType<typeof GitHub> {
    if (config.githubUrl != null) {
        const octokit = GitHub.plugin(enterpriseServer30);
        const githubUrl = config.githubUrl.endsWith("/") ? config.githubUrl : (config.githubUrl + "/");
        return new octokit(getOctokitOptions(context.env.GITHUB_TOKEN, {
            baseUrl: githubUrl + "api/v3"
        }));
    }

    return github.getOctokit(context.env.GITHUB_TOKEN);
}
