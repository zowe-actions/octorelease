import * as github from "@actions/github";
import delay from "delay";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.env.GITHUB_TOKEN == null) {
        throw new Error("Required environment variable GITHUB_TOKEN is undefined");
    }

    if (config.checkPrLabels) {
        const releaseLabels = Array.isArray(config.checkPrLabels) ? config.checkPrLabels :
            ["no-release", "release-patch", "release-minor", "release-major"];
        const releaseType = await getPrReleaseType(context, releaseLabels);
        if (releaseType != null) {
            context.version.new = require("semver").inc(context.version.old, releaseType);
        }
    }
}

async function getPrReleaseType(context: IContext, releaseLabels: string[]): Promise<string | null> {
    const octokit = github.getOctokit(context.env.GITHUB_TOKEN);
    const prs = await octokit.repos.listPullRequestsAssociatedWithCommit({
        ...github.context.repo,
        commit_sha: github.context.sha
    });

    if (prs.data.length === 0) {
        context.logger.warning(`Could not find pull request associated with commit ${github.context.sha}`);
        return null;
    }

    const prNumber = prs.data[0].number;
    const labels = await octokit.issues.listLabelsOnIssue({
        ...github.context.repo,
        issue_number: prNumber
    });

    if (labels.data.findIndex(label => label.name === "released") !== -1) {
        context.logger.warning("Pull request already released, no new version detected");
        return null;
    }

    const events = await octokit.issues.listEvents({
        ...github.context.repo,
        issue_number: prNumber
    });
    const collaborators = await octokit.repos.listCollaborators(github.context.repo);
    let approvedLabelEvents = findApprovedLabelEvents(events.data, collaborators.data, releaseLabels);

    if (approvedLabelEvents.length !== 1) {
        const timeoutInMinutes = 30;

        // Remove unapproved release labels
        for (const { name } of labels.data.filter(label => releaseLabels.includes(label.name))) {
            await octokit.issues.removeLabel({
                ...github.context.repo,
                issue_number: prNumber,
                name
            });
        }

        // Comment on PR to request version approval
        const comment = await octokit.issues.createComment({
            ...github.context.repo,
            issue_number: prNumber,
            body: `Version info from a repo admin is required to publish a new version. ` +
                `Please add one of the following labels within ${timeoutInMinutes} minutes:\n` +
                `* **${releaseLabels[0]}** (default): \`${context.version.old}\`\n` +
                `* **${releaseLabels[1]}**: \`${require("semver").inc(context.version.old, "patch")}\`\n` +
                `* **${releaseLabels[2]}**: \`${require("semver").inc(context.version.old, "minor")}\`\n` +
                `* **${releaseLabels[3]}**: \`${require("semver").inc(context.version.old, "major")}\`\n\n` +                
                `<sub>Powered by Octorelease :rocket:</sub>`
        });

        // Wait for release label to be added to PR
        context.logger.info("Waiting for repo admin to add release label to pull request...");
        const startTime = new Date().getTime();
        const timeoutInMsec = timeoutInMinutes * 60000;
        let lastEtag = events.headers.etag;
        while (approvedLabelEvents.length !== 1 && (new Date().getTime() - startTime) < timeoutInMsec) {
            await delay(1000);
            const response = await octokit.issues.listEvents({
                ...github.context.repo,
                issue_number: prNumber,
                headers: { "if-none-match": lastEtag }
            });
            if ((response as any).status === 304) {  // temp for debugging
                context.logger.info("etag cached");
            }
            if (response.status === 200) {
                approvedLabelEvents = findApprovedLabelEvents(response.data, collaborators.data, releaseLabels);
                lastEtag = response.headers.etag;
            }
        }

        // If release label was added, react to comment and remove the label
        if (approvedLabelEvents.length === 1) {
            const event: any = approvedLabelEvents[0];
            context.logger.info(`Release label "${event.label.name}" was added by ${event.actor.login}`);

            await octokit.issues.removeLabel({
                ...github.context.repo,
                issue_number: prNumber,
                name: event.label.name
            });

            await octokit.reactions.createForIssueComment({
                ...github.context.repo,
                comment_id: comment.data.id,
                content: "eyes"
            });
        } else {
            context.logger.info("Timed out waiting for release label");
        }
    }

    if (approvedLabelEvents.length === 1 && approvedLabelEvents[0].label?.name != null) {
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
