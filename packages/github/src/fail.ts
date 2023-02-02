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

import { IContext, utils } from "@octorelease/core";
import { DEFAULT_RELEASE_LABELS, IPluginConfig } from "./config";
import { getOctokit } from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (!config.checkPrLabels) {
        return;
    }

    const octokit = getOctokit(context, config);
    const prs = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
        ...context.ci.repo,
        commit_sha: context.ci.commit
    });
    if (prs.data.length === 0) {
        return;
    }

    const prNumber = prs.data[0].number;
    const labels = await octokit.rest.issues.listLabelsOnIssue({
        ...context.ci.repo,
        issue_number: prNumber
    });
    const releaseLabels = Array.isArray(config.checkPrLabels) ? config.checkPrLabels : DEFAULT_RELEASE_LABELS;

    for (const { name } of labels.data.filter(label => releaseLabels.includes(label.name))) {
        await utils.dryRunTask(context, `remove pull request label "${name}"`, async () => {
            await octokit.rest.issues.removeLabel({
                ...context.ci.repo,
                issue_number: prNumber,
                name
            });
        });
    }
}
