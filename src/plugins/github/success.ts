import * as core from "@actions/core";
import * as github from "@actions/github";
import { IContext } from "../../doc";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    const octokit = github.getOctokit(context.env.GITHUB_TOKEN);
    const prs = await octokit.repos.listPullRequestsAssociatedWithCommit({
        ...github.context.repo,
        commit_sha: github.context.sha
    });

    if (prs.data.length > 0) {
        await octokit.issues.addLabels({
            ...github.context.repo,
            issue_number: prs.data[0].number,
            labels: ["released"]
        });
    }
}
