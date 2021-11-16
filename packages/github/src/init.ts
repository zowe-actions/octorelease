import * as http from "http";
import * as github from "@actions/github";
import { Webhooks, createNodeMiddleware } from "@octokit/webhooks";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.env.GITHUB_TOKEN == null) {
        throw new Error("Required environment variable GITHUB_TOKEN is undefined");
    }

    if (config.checkPrLabels) {
        const releaseLabels = Array.isArray(config.checkPrLabels) ? config.checkPrLabels :
            ["release-major", "release-minor", "release-patch", "no-release"];
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

    if (labels.data.find(label => label.name === "released")) {
        context.logger.warning("Pull request already released, no new version detected");
        return null;
    }

    const events = await octokit.issues.listEvents({
        ...github.context.repo,
        issue_number: prNumber
    });
    const collaborators = await octokit.repos.listCollaborators(github.context.repo);
    let approvedLabelEvents = events.data.filter((event, idx) => checkPrEventForApprovedLabel(event, events.data.slice(idx + 1), collaborators.data, releaseLabels));

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
                `* **${releaseLabels[0]}**: \`${require("semver").major(context.version.old)}\`\n` +
                `* **${releaseLabels[1]}**: \`${require("semver").minor(context.version.old)}\`\n` +
                `* **${releaseLabels[2]}**: \`${require("semver").patch(context.version.old)}\`\n` +
                `* **${releaseLabels[3]}** (default): \`${context.version.old}\`\n\n` +
                `<sub>Powered by Octorelease :rocket:</sub>`
        });

        // Wait for release label to be added to PR
        const webhooks = new Webhooks({ secret: context.env.GITHUB_TOKEN });
        let server: http.Server | undefined;
        context.logger.info("Waiting for repo admin to add release label to pull request...");
        approvedLabelEvents = await new Promise((resolve, reject) => {
            webhooks.onAny((event) => {
                if (event.name === "label" && event.payload.action === "created" && releaseLabels.includes(event.payload.label.name) &&
                    isUserAdmin(event.payload.sender.id, collaborators.data)) {
                    context.logger.info(`Release label "${event.payload.label.name}" was added by ${event.payload.sender.login}`);
                    resolve([event.payload]);
                }
            });
            server = http.createServer(createNodeMiddleware(webhooks)).listen();
            setTimeout(() => {
                context.logger.info("Timed out waiting for release label");
                resolve([]);
            }, timeoutInMinutes * 60000);
        });
        server?.close();

        // React to comment if release label was added
        if (approvedLabelEvents.length === 1) {
            await octokit.reactions.createForIssueComment({
                ...github.context.repo,
                comment_id: comment.data.id,
                content: "eyes"
            });
        }
    }

    if (approvedLabelEvents.length === 1 && approvedLabelEvents[0].label?.name != null) {
        return ["major", "minor", "patch", null][releaseLabels.indexOf(approvedLabelEvents[0].label.name)];
    }

    return null;
}

function checkPrEventForApprovedLabel(event: any, futureEvents: any[], collaborators: any[], releaseLabels: string[]): boolean {
    /**
     * Ignore the following:
     *  - Other kinds of events besides label creation
     *  - Labels that were added before the PR was merged
     *  - Labels that were temporarily added and later removed
     *  - Labels that were added by user without admin privileges
     *  - Non-release labels with names we don't care about
     */
    if (event.event !== "labeled") {
        return false;
    } else if (futureEvents.find(e => e.event === "merged") != null) {
        return false;
    } else if (futureEvents.find(e => e.event === "unlabeled" && e.label.name === event.label.name) != null) {
        return false;
    } else if (!isUserAdmin(event.actor.id, collaborators)) {
        return false;
    } else if (!releaseLabels.includes(event.label.name)) {
        return false;
    }

    return true;
}

function isUserAdmin(userId: number, collaborators: any[]): boolean {
    return collaborators.find(user => user.id === userId && user.permissions?.admin) != null;
}
