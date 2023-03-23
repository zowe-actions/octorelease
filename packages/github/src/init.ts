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

import { RequestError } from "@octokit/request-error";
import delay from "delay";
import { IContext, Inputs } from "@octorelease/core";
import { DEFAULT_RELEASE_LABELS, IPluginConfig } from "./config";
import * as utils from "./utils";

let lastEtag: string | undefined;

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.env.GITHUB_TOKEN == null) {
        throw new Error("Required environment variable GITHUB_TOKEN is undefined");
    }

    if (config.checkPrLabels && Inputs.newVersion == null) {
        const releaseType = await getPrReleaseType(context, config);
        const oldVersion = (context.version.new || context.version.old).split("-")[0];
        context.version.new = releaseType != null ? require("semver").inc(oldVersion, releaseType) : oldVersion;
    }
}

async function getPrReleaseType(context: IContext, config: IPluginConfig): Promise<string | null> {
    const octokit = utils.getOctokit(context, config);
    const prNumber = await utils.findPrNumber(context, octokit);
    if (prNumber == null) {
        return null;
    }

    const labels = await octokit.rest.issues.listLabelsOnIssue({
        ...context.ci.repo,
        issue_number: prNumber
    });
    if (labels.data.some(label => label.name === "released")) {
        context.logger.warn("Pull request already released, no new version detected");
        return null;
    }

    const releaseLabels = Array.isArray(config.checkPrLabels) ? config.checkPrLabels : DEFAULT_RELEASE_LABELS;
    let approvedLabelEvents = await findApprovedLabelEvents(context, octokit, prNumber, releaseLabels);

    if (approvedLabelEvents.length !== 1 && !context.dryRun) {
        const timeoutInMinutes = 30;

        // Remove unapproved release labels
        for (const { name } of labels.data.filter(label => releaseLabels.includes(label.name))) {
            await octokit.rest.issues.removeLabel({
                ...context.ci.repo,
                issue_number: prNumber,
                name
            });
        }

        // Comment on PR to request version approval
        const oldVersion = (context.version.new || context.version.old).split("-")[0];
        const prereleaseSuffix = (context.version.prerelease != null) ? `-${context.version.prerelease}` : "";
        const semverInc = require("semver/functions/inc");
        let commentBody = `Version info from a repo admin is required to publish a new version. ` +
            `Please add one of the following labels within ${timeoutInMinutes} minutes:\n` +
            `* **${releaseLabels[0]}**: \`${oldVersion}${prereleaseSuffix}\` (default)\n` +
            `* **${releaseLabels[1]}**: \`${semverInc(oldVersion, "patch")}${prereleaseSuffix}\`\n`;
        if (context.branch.level !== "patch") {
            commentBody += `* **${releaseLabels[2]}**: \`${semverInc(oldVersion, "minor")}${prereleaseSuffix}\`\n`;
        }
        if (context.branch.level !== "patch" && context.branch.level !== "minor") {
            commentBody += `* **${releaseLabels[3]}**: \`${semverInc(oldVersion, "major")}${prereleaseSuffix}\`\n`;
        }
        const comment = await octokit.rest.issues.createComment({
            ...context.ci.repo,
            issue_number: prNumber,
            body: commentBody + "\n<sub>Powered by Octorelease :rocket:</sub>"
        });

        // Wait for release label to be added to PR
        context.logger.info("Waiting for repo admin to add release label to pull request...");
        const startTime = new Date().getTime();
        const timeoutInMsec = timeoutInMinutes * 60000;
        while (approvedLabelEvents.length !== 1 && (new Date().getTime() - startTime) < timeoutInMsec) {
            await delay(1000);

            try {
                approvedLabelEvents = await findApprovedLabelEvents(context, octokit, prNumber, releaseLabels);
            } catch (error) {
                if (!(error instanceof RequestError && error.status === 304)) {
                    throw error;
                }
            }
        }

        if (approvedLabelEvents.length === 1) {
            context.logger.info(`Release label "${approvedLabelEvents[0].label.name}" was added by ` +
                approvedLabelEvents[0].actor.login);
        } else {
            context.logger.info("Timed out waiting for release label");
        }

        // Delete comment since it is no longer useful
        await octokit.rest.issues.deleteComment({
            ...context.ci.repo,
            comment_id: comment.data.id
        });
    }

    if (approvedLabelEvents.length === 1) {
        return [null, "patch", "minor", "major"][releaseLabels.indexOf(approvedLabelEvents[0].label.name)];
    }

    return null;
}

async function findApprovedLabelEvents(context: IContext, octokit: utils.Octokit, prNumber: number,
    releaseLabels: string[]): Promise<Record<string, any>[]> {
    const getCollaboratorPermissionLevel = (username: string) =>
        octokit.rest.repos.getCollaboratorPermissionLevel({ ...context.ci.repo, username });
    const events = await octokit.rest.issues.listEvents({
        ...context.ci.repo,
        issue_number: prNumber,
        per_page: 100,
        headers: lastEtag ? { "if-none-match": lastEtag } : undefined
    });
    lastEtag = events.headers.etag;

    /**
     * Filter to remove the following:
     *  - Other kinds of events besides label creation
     *  - Non-release labels with names we don't care about
     *  - Labels that were added before the PR was merged
     *  - Labels that were temporarily added and later removed
     *  - Labels that were added by user without admin privileges
     */
    return utils.filterAsync(events.data, async (current: any, index: number) => {
        const futureEvents: any[] = events.data.slice(index + 1);

        if (current.event !== "labeled") {
            return false;
        } else if (!releaseLabels.includes(current.label.name)) {
            return false;
        } else if (futureEvents.some(e => e.event === "merged")) {
            return false;
        } else if (futureEvents.some(e => e.event === "unlabeled" && e.label.name === current.label.name)) {
            return false;
        } else if ((await getCollaboratorPermissionLevel(current.actor.login)).data.permission !== "admin") {
            return false;
        }

        return true;
    });
}
