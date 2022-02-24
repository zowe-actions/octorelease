import { RequestError } from "@octokit/request-error";
import delay from "delay";
import { IContext, Inputs } from "@octorelease/core";
import { DEFAULT_RELEASE_LABELS, IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.env.GITHUB_TOKEN == null) {
        throw new Error("Required environment variable GITHUB_TOKEN is undefined");
    }

    if (config.checkPrLabels && Inputs.newVersion == null) {
        const releaseType = await getPrReleaseType(context, config);
        if (releaseType != null) {
            context.version.new = require("semver").inc(context.version.old, releaseType);
        }
    }
}

async function getPrReleaseType(context: IContext, config: IPluginConfig): Promise<string | null> {
    const octokit = utils.getOctokit(context, config);
    const prs = await octokit.repos.listPullRequestsAssociatedWithCommit({
        ...context.ci.repo,
        commit_sha: context.ci.commit
    });

    if (prs.data.length === 0) {
        context.logger.warning(`Could not find pull request associated with commit ${context.ci.commit}`);
        return null;
    }

    const prNumber = prs.data[0].number;
    const labels = await octokit.issues.listLabelsOnIssue({
        ...context.ci.repo,
        issue_number: prNumber
    });

    if (labels.data.findIndex(label => label.name === "released") !== -1) {
        context.logger.warning("Pull request already released, no new version detected");
        return null;
    }

    const events = await octokit.issues.listEvents({
        ...context.ci.repo,
        issue_number: prNumber
    });
    const collaborators = await octokit.repos.listCollaborators(context.ci.repo);
    const releaseLabels = Array.isArray(config.checkPrLabels) ? config.checkPrLabels : DEFAULT_RELEASE_LABELS;
    let approvedLabelEvents = findApprovedLabelEvents(events.data, collaborators.data, releaseLabels);

    if (approvedLabelEvents.length !== 1 && !context.dryRun) {
        const timeoutInMinutes = 30;

        // Remove unapproved release labels
        for (const { name } of labels.data.filter(label => releaseLabels.includes(label.name))) {
            await octokit.issues.removeLabel({
                ...context.ci.repo,
                issue_number: prNumber,
                name
            });
        }

        // Comment on PR to request version approval
        const oldVersion = (context.version.prerelease != null) ?
            `${context.version.old.split("-")[0]}-${context.version.prerelease}` : context.version.old;
        const comment = await octokit.issues.createComment({
            ...context.ci.repo,
            issue_number: prNumber,
            body: `Version info from a repo admin is required to publish a new version. ` +
                `Please add one of the following labels within ${timeoutInMinutes} minutes:\n` +
                `* **${releaseLabels[0]}**: \`${oldVersion}\` (default)\n` +
                `* **${releaseLabels[1]}**: \`${require("semver").inc(oldVersion, "patch")}\`\n` +
                `* **${releaseLabels[2]}**: \`${require("semver").inc(oldVersion, "minor")}\`\n` +
                `* **${releaseLabels[3]}**: \`${require("semver").inc(oldVersion, "major")}\`\n\n` +
                `<sub>Powered by Octorelease :rocket:</sub>`
        });

        // Wait for release label to be added to PR
        context.logger.info("Waiting for repo admin to add release label to pull request...");
        const startTime = new Date().getTime();
        const timeoutInMsec = timeoutInMinutes * 60000;
        let lastEtag = events.headers.etag;
        while (approvedLabelEvents.length !== 1 && (new Date().getTime() - startTime) < timeoutInMsec) {
            await delay(1000);

            try {
                const response = await octokit.issues.listEvents({
                    ...context.ci.repo,
                    issue_number: prNumber,
                    headers: { "if-none-match": lastEtag }
                });
                approvedLabelEvents = findApprovedLabelEvents(response.data, collaborators.data, releaseLabels);
                lastEtag = response.headers.etag;
            } catch (error) {
                if (!(error instanceof RequestError && error.status === 304)) {
                    throw error;
                }
            }
        }

        if (approvedLabelEvents.length === 1) {
            context.logger.info(`Release label "${approvedLabelEvents[0].label.name}" was added by ${approvedLabelEvents[0].actor.login}`);
        } else {
            context.logger.info("Timed out waiting for release label");
        }

        // Delete comment since it is no longer useful
        await octokit.issues.deleteComment({
            ...context.ci.repo,
            comment_id: comment.data.id
        });
    }

    if (approvedLabelEvents.length === 1) {
        return [null, "patch", "minor", "major"][releaseLabels.indexOf(approvedLabelEvents[0].label.name)];
    }

    return null;
}

function findApprovedLabelEvents(events: any[], collaborators: any[], releaseLabels: string[]): any[] {
    /**
     * Filter to remove the following:
     *  - Other kinds of events besides label creation
     *  - Labels that were added before the PR was merged
     *  - Labels that were temporarily added and later removed
     *  - Labels that were added by user without admin privileges
     *  - Non-release labels with names we don't care about
     */
    return events.filter((event, idx) => {
        const futureEvents = events.slice(idx + 1);

        if (event.event !== "labeled") {
            return false;
        } else if (futureEvents.findIndex(e => e.event === "merged") !== -1) {
            return false;
        } else if (futureEvents.findIndex(e => e.event === "unlabeled" && e.label.name === event.label.name) !== -1) {
            return false;
        } else if (collaborators.findIndex(user => user.id === event.actor.id && user.permissions?.admin) === -1) {
            return false;
        } else if (!releaseLabels.includes(event.label.name)) {
            return false;
        }
    
        return true;
    });
}
