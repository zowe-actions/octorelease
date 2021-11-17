import * as github from "@actions/github";
import { IContext } from "@octorelease/core";
import { DEFAULT_RELEASE_LABELS, IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (config.checkPrLabels) {
        const octokit = github.getOctokit(context.env.GITHUB_TOKEN);
        const prs = await octokit.repos.listPullRequestsAssociatedWithCommit({
            ...github.context.repo,
            commit_sha: github.context.sha
        });

        if (prs.data.length > 0) {
            const prNumber = prs.data[0].number;
            const labels = await octokit.issues.listLabelsOnIssue({
                ...github.context.repo,
                issue_number: prNumber
            });
            const releaseLabels = Array.isArray(config.checkPrLabels) ? config.checkPrLabels : DEFAULT_RELEASE_LABELS;

            for (const { name } of labels.data.filter(label => releaseLabels.includes(label.name))) {
                await octokit.issues.removeLabel({
                    ...github.context.repo,
                    issue_number: prNumber,
                    name
                });
            }
        }
    }
}
