import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as glob from "@actions/glob";
import { IContext } from "../../doc";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.version.new != null) {
        const octokit = github.getOctokit(context.env.GITHUB_TOKEN);
        const release = await createRelease(octokit, context.version.new, context.releaseNotes);
        if (config.assets?.length > 0) {
            const assetPaths: string[] = (typeof config.assets === "string") ? [config.assets] : config.assets;
            await uploadAssets(octokit, release, assetPaths);
        }
    }
}

async function createRelease(octokit: any, newVersion: string, releaseNotes?: string) {
    const tagName = `v${newVersion}`;
    let release: any;

    // Get release if it already exists
    try {
        release = await octokit.repos.getReleaseByTag({
            ...github.context.repo,
            tag: tagName
        });
    } catch (err) {
        if (err.status != 404) {
            throw err;
        }
    }

    // Create release if it doesn't exist and try to add release notes
    if (release == null) {
        core.info(`Creating GitHub release with tag ${tagName}`);
        release = await octokit.repos.createRelease({
            ...github.context.repo,
            tag_name: tagName,
            body: releaseNotes
        });
    }

    return release;
}

async function uploadAssets(octokit: any, release: any, assetPaths: string[]) {
    const globber = await glob.create(assetPaths.join("\n"));
    const artifactPaths: string[] = await globber.glob();
    const mime = require("mime-types");

    for (const artifactPath of artifactPaths) {
        const assetName = path.basename(artifactPath);

        // Skip uploading asset if one with same name was uploaded previously
        if (release.data.assets && release.data.assets.findIndex((asset: any) => asset.name === assetName) !== -1) {
            core.error(`Release asset ${artifactPath} has already been uploaded to GitHub`);
            continue;
        }

        core.info(`Uploading release asset ${artifactPath}`);
        await octokit.repos.uploadReleaseAsset({
            ...github.context.repo,
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
    }
}
