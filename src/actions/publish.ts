import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as glob from "@actions/glob";
import { IContext } from "../doc";
import * as utils from "../utils";

export default async function (context: IContext): Promise<void> {
    for (const publishType in context.publishConfig) {
        switch (publishType) {
            case "github":
                await publishGithub(context);
                break;
            case "npm":
                if (context.isMonorepo) {
                    for (const { location } of await utils.lernaList()) {
                        await publishNpm(context, location);
                    }
                } else {
                    await publishNpm(context);
                }
                break;
        }
    }

    const prNumber = core.getState("pr-number");
    if (prNumber != null) {
        const octokit = github.getOctokit(core.getInput("github-token"));
        await octokit.issues.addLabels({
            ...github.context.repo,
            issue_number: prNumber,
            labels: ["released"]
        });
    }
}

async function publishGithub(context: IContext): Promise<void> {
    const jsonFile = context.isMonorepo ? "lerna.json" : "package.json";
    const packageVersion = JSON.parse(fs.readFileSync(jsonFile, "utf-8")).version;
    const tagName = `v${packageVersion}`;

    const octokit = github.getOctokit(core.getInput("github-token"));
    let release;

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
        const releaseNotes = await getReleaseNotes(context, packageVersion);

        core.info(`Creating GitHub release with tag ${tagName}`);
        release = await octokit.repos.createRelease({
            ...github.context.repo,
            tag_name: tagName,
            body: releaseNotes
        });
    }

    // Upload artifacts to release
    const globber = await glob.create(context.publishConfig.github.assets);
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

async function publishNpm(context: IContext, inDir?: string): Promise<void> {
    const cwd = inDir || process.cwd();

    if (context.publishConfig.npm.tarballDir != null) {
        const tgzFile = await utils.npmPack(inDir);
        fs.mkdirSync(context.publishConfig.npm.tarballDir, { recursive: true });
        fs.renameSync(path.join(cwd, tgzFile), path.join(context.publishConfig.npm.tarballDir, path.basename(tgzFile)));
    }

    if (!context.publishConfig.npm.npmPublish) {
        return;
    }

    const packageJson = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf-8"));

    if (packageJson.private) {
        core.info(`Skipping publish of private package ${packageJson.name}`);
    }

    const npmRegistry: string | undefined = packageJson.publishConfig?.registry;
    let npmScope: string | undefined;

    if (npmRegistry == null) {
        throw new Error("Expected NPM registry to be defined in package.json but it is not");
    }

    if (packageJson.name.includes("/")) {
        npmScope = packageJson.name.split("/")[0];
    }

    utils.npmConfig(context, npmRegistry, npmScope);

    try {
        // Publish package
        const alreadyPublished = await utils.npmViewVersion(packageJson.name, packageJson.version);
        if (!alreadyPublished) {
            await utils.npmPublish(context.branch.tag, inDir);
        } else {
            core.error(`Version ${packageJson.version} has already been published to NPM`);
        }

        // Add alias tags
        if (context.branch.aliasTags) {
            for (const tag of context.branch.aliasTags) {
                await utils.npmAddTag(packageJson.name, packageJson.version, tag, inDir);
            }
        }
    } finally {
        utils.npmReset();
    }
}

async function getReleaseNotes(context: IContext, packageVersion: string): Promise<string | undefined> {
    if (context.isMonorepo) {
        let releaseNotes = "";

        for (const { name, version, location } of await utils.lernaList()) {
            const changelogFile = path.join(path.relative(process.cwd(), location), "CHANGELOG.md");
            const packageReleaseNotes = getPackageChangelog(changelogFile, version);
            if (packageReleaseNotes != null) {
                releaseNotes += `**${name}**\n${packageReleaseNotes}\n\n`;
            }
        }

        return releaseNotes || undefined;
    } else {
        return getPackageChangelog("CHANGELOG.md", packageVersion);
    }
}

function getPackageChangelog(changelogFile: string, packageVersion: string): string | undefined {
    let releaseNotes = "";

    if (fs.existsSync(changelogFile)) {
        const changelogLines: string[] = fs.readFileSync(changelogFile, "utf-8").split(/\r?\n/);
        let lineNum = changelogLines.findIndex(line => line.startsWith(`## \`${packageVersion}\``));

        if (lineNum !== -1) {
            while (changelogLines[lineNum + 1] != null && !changelogLines[lineNum + 1].startsWith("## ")) {
                lineNum++;
                releaseNotes += changelogLines[lineNum] + "\n";
            }
            core.info(`Found changelog header in ${changelogFile}`);
        } else {
            core.warning(`Missing changelog header in ${changelogFile}`);
        }
    } else {
        core.warning(`Missing changelog file ${changelogFile}`);
    }

    return releaseNotes.trim() || undefined;
}
