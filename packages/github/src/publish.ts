/**
 * Copyright 2022 Octorelease Contributors
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

import * as fs from "fs";
import * as path from "path";
import * as glob from "@actions/glob";
import { RequestError } from "@octokit/request-error";
import { IContext, utils as coreUtils } from "@octorelease/core";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (!config.createRelease && !config.assets) {
        return;
    }

    const octokit = utils.getOctokit(context, config);
    const release = await createRelease(context, octokit);
    if (config.assets != null && config.assets.length > 0) {
        const assetPaths: string[] = (typeof config.assets === "string") ? [config.assets] : config.assets;
        await uploadAssets(context, octokit, release, assetPaths);
    }
}

async function createRelease(context: IContext, octokit: any): Promise<any> {
    const tagName = context.tagPrefix + context.version.new;
    let release: any;

    // Get release if it already exists
    try {
        release = await octokit.repos.getReleaseByTag({
            ...context.ci.repo,
            tag: tagName
        });
    } catch (error) {
        const notFound = 404;
        if (!(error instanceof RequestError && error.status === notFound)) {
            throw error;
        }
    }

    // Create release if it doesn't exist and try to add release notes
    if (release == null) {
        context.logger.info(`Creating GitHub release with tag ${tagName}`);
        release = await coreUtils.dryRunTask(context, "create GitHub release", async () => {
            return octokit.repos.createRelease({
                ...context.ci.repo,
                tag_name: tagName,
                body: context.releaseNotes
            });
        }) || { data: {} };
    }

    return release;
}

async function uploadAssets(context: IContext, octokit: any, release: any, assetPaths: string[]): Promise<void> {
    const globber = await glob.create(assetPaths.join("\n"));
    const artifactPaths: string[] = await globber.glob();
    const mime = require("mime-types");

    for (const artifactPath of artifactPaths) {
        const assetName = path.basename(artifactPath);

        // Skip uploading asset if one with same name was uploaded previously
        if (release.data.assets && release.data.assets.findIndex((asset: any) => asset.name === assetName) !== -1) {
            context.logger.error(`Release asset ${artifactPath} has already been uploaded to GitHub`);
            continue;
        }

        context.logger.info(`Uploading release asset ${artifactPath}`);
        await coreUtils.dryRunTask(context, "upload GitHub release asset", async () => {
            await octokit.repos.uploadReleaseAsset({
                ...context.ci.repo,
                release_id: release.data.id,
                name: assetName,
                // Need to upload as buffer because converting to string corrupts binary data
                data: fs.readFileSync(artifactPath) as any,
                url: release.data.upload_url,
                headers: {
                    "Content-Length": fs.statSync(artifactPath).size,
                    "Content-Type": mime.lookup(artifactPath) || "application/octet-stream"
                }
            });
        });
    }
}
