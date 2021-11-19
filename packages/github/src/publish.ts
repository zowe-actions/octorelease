import * as fs from "fs";
import * as path from "path";
import * as github from "@actions/github";
import * as glob from "@actions/glob";
import { RequestError } from "@octokit/request-error";
import { IContext, utils as coreUtils } from "@octorelease/core";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.version.new != null) {
        const octokit = utils.getOctokit(context, config);
        const release = await createRelease(context, octokit);
        if (config.assets != null && config.assets.length > 0) {
            const assetPaths: string[] = (typeof config.assets === "string") ? [config.assets] : config.assets;
            await uploadAssets(context, octokit, release, assetPaths);
        }
    }
}

async function createRelease(context: IContext, octokit: any): Promise<any> {
    const tagName = `v${context.version.new}`;
    let release: any;

    // Get release if it already exists
    try {
        release = await octokit.repos.getReleaseByTag({
            ...context.ci.repo,
            tag: tagName
        });
    } catch (error) {
        if (!(error instanceof RequestError && error.status === 404)) {
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
        })
    }
}
