import * as github from "@actions/github";
import { IContext, utils } from "@octorelease/core";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    const octokit = github.getOctokit(context.env.GITHUB_TOKEN);
    const prs = await octokit.repos.listPullRequestsAssociatedWithCommit({
        ...github.context.repo,
        commit_sha: github.context.sha
    });

    if (prs.data.length > 0) {
        await utils.dryRunTask(context, "add released label to pull request", async () => {
            await octokit.issues.addLabels({
                ...github.context.repo,
                issue_number: prs.data[0].number,
                labels: ["released"]
            });
        });

        if (Object.keys(context.releasedPackages).length > 0) {
            const packageList: string[] = [];
            for (const pkgType of Object.keys(context.releasedPackages)) {
                for (const { name, url } of context.releasedPackages[pkgType]) {
                    const pkgName = url != null ? `[${name}](${url})` : `\`${name}\``;
                    packageList.push(`**${pkgType}**: ${pkgName}`);
                }
            }
            await utils.dryRunTask(context, "create success comment on pull request", async () => {
                await octokit.issues.createComment({
                    ...github.context.repo,
                    issue_number: prs.data[0].number,
                    body: `Release succeeded for the \`${context.branch.name}\` branch. :tada:\n\n` +
                    `The following packages have been published:\n` +
                    packageList.map(line => `* ${line}`).join("\n") + `\n\n` +
                    `<sub>Powered by Octorelease :rocket:</sub>`
                });
            });
        }
    }
}
