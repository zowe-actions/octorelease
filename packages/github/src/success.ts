import * as github from "@actions/github";
import { IContext, utils } from "@octorelease/core";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    const octokit = github.getOctokit(context.env.GITHUB_TOKEN);
    const prs = await octokit.repos.listPullRequestsAssociatedWithCommit({
        ...context.ci.repo,
        commit_sha: context.ci.sha
    });

    if (prs.data.length > 0) {
        await utils.dryRunTask(context, "add released label to pull request", async () => {
            await octokit.issues.addLabels({
                ...context.ci.repo,
                issue_number: prs.data[0].number,
                labels: ["released"]
            });
        });
    }
}
