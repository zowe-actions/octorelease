import { IContext, utils } from "@octorelease/core";
import { DEFAULT_RELEASE_LABELS, IPluginConfig } from "./config";
import { getOctokit } from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (config.checkPrLabels) {
        const octokit = getOctokit(context, config);
        const prs = await octokit.repos.listPullRequestsAssociatedWithCommit({
            ...context.ci.repo,
            commit_sha: context.ci.commit
        });

        if (prs.data.length > 0) {
            const prNumber = prs.data[0].number;
            const labels = await octokit.issues.listLabelsOnIssue({
                ...context.ci.repo,
                issue_number: prNumber
            });
            const releaseLabels = Array.isArray(config.checkPrLabels) ? config.checkPrLabels : DEFAULT_RELEASE_LABELS;

            for (const { name } of labels.data.filter(label => releaseLabels.includes(label.name))) {
                await utils.dryRunTask(context, `remove pull request label "${name}"`, async () => {
                    await octokit.issues.removeLabel({
                        ...context.ci.repo,
                        issue_number: prNumber,
                        name
                    });
                });
            }
        }
    }
}
