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

import { IContext, utils as coreUtils } from "@octorelease/core";
import { DEFAULT_RELEASE_LABELS, IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    const octokit = utils.getOctokit(context, config);
    const prNumber = await utils.findPrNumber(context, octokit);
    if (prNumber == null) {
        return;
    }

    if (config.checkPrLabels) {
        const labels = await octokit.rest.issues.listLabelsOnIssue({
            ...context.ci.repo,
            issue_number: prNumber
        });
        const releaseLabels = Array.isArray(config.checkPrLabels) ? config.checkPrLabels : DEFAULT_RELEASE_LABELS;

        for (const { name } of labels.data.filter(label => releaseLabels.includes(label.name))) {
            await coreUtils.dryRunTask(context, `remove pull request label "${name}"`, async () => {
                await octokit.rest.issues.removeLabel({
                    ...context.ci.repo,
                    issue_number: prNumber,
                    name
                });
            });
        }
    }

    const workflowRunUrl = `${config.githubUrl || "https://github.com"}/${(context.ci as any).slug}/actions/runs/` +
        (context.ci as any).build;
    await coreUtils.dryRunTask(context, "create failure comment on pull request", async () => {
        await octokit.rest.issues.createComment({
            ...context.ci.repo,
            issue_number: prNumber,
            body: `Release failed for the \`${context.branch.name}\` branch. :cry:\n\n` +
                "```\n" + context.failError?.stack + "```\n" +
                `Check the [workflow run](${workflowRunUrl}) for more error details.\n\n` +
                `<sub>Powered by Octorelease :rocket:</sub>`
        });
    });
}
