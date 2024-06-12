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

import * as github from "@actions/github";
import { GitHub, getOctokitOptions } from "@actions/github/lib/utils";
import { enterpriseServer37 } from "@octokit/plugin-enterprise-server";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";

export type Octokit = ReturnType<typeof github.getOctokit>;

export async function filterAsync<T>(array: T[],
    predicate: (value: T, index: number, array: T[]) => Promise<boolean>): Promise<T[]> {
    // https://stackoverflow.com/questions/33355528
    const filterMap = await Promise.all(array.map(predicate));
    return array.filter((_value, index) => filterMap[index]);
}

export async function findPrNumber(context: IContext, octokit: Octokit): Promise<number | undefined> {
    const prs = (await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
        ...context.ci.repo,
        commit_sha: context.ci.commit
    })).data.filter(pr => pr.merged_at != null);

    if (prs.length === 0) {
        context.logger.warn(`Could not find merged pull request associated with commit ${context.ci.commit}`);
    }

    return prs[0]?.number;
}

export function getOctokit(context: IContext, config: IPluginConfig): Octokit {
    if (config.githubUrl != null) {
        const octokit = GitHub.plugin(enterpriseServer37);
        const githubUrl = config.githubUrl.endsWith("/") ? config.githubUrl : (config.githubUrl + "/");
        return new octokit(getOctokitOptions(context.env.GITHUB_TOKEN, {
            baseUrl: githubUrl + "api/v3"
        }));
    }

    return github.getOctokit(context.env.GITHUB_TOKEN);
}
