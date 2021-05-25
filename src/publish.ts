import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as glob from "@actions/glob";
import { IContext } from "./doc";
import * as utils from "./utils";

export class Publish {
    private static newVersion: string;

    public static async publish(context: IContext, newVersion: string): Promise<void> {
        this.newVersion = newVersion;

        for (const publishType of context.config.publishConfig) {
            switch (publishType) {
                case "github":
                    await this.publishGithub(context);
                    break;
                case "lerna":
                    await this.publishLerna(context);
                    break;
                case "npm":
                    await this.publishNpm(context);
                    break;
            }
        }
    }

    private static async publishGithub(context: IContext): Promise<void> {
        const octokit = github.getOctokit(context.github.token);
        const tagName = `v${this.newVersion}`;
        let release;

        // Get release if it already exists
        try {
            release = await octokit.repos.getReleaseByTag({
                ...context.repository,
                tag: tagName
            });
        } catch (err) {
            if (err.status != 404) {
                throw err;
            }
        }

        // Create release if it doesn't exist and try to add release notes
        if (release == null) {
            const releaseNotes = await this.getReleaseNotes(context);

            core.info(`Creating GitHub release with tag ${tagName}`);
            release = await octokit.repos.createRelease({
                ...context.repository,
                tag_name: tagName,
                body: releaseNotes
            });
        }

        // Upload artifacts to release
        const globber = await glob.create("dist/*");
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
                ...context.repository,
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

    private static async publishLerna(context: IContext): Promise<void> {
        for (const { location } of (await utils.lernaList()).filter(pkg => pkg.changed)) {
            await this.publishNpm(context, location);
        }
    }

    private static async publishNpm(context: IContext, inDir?: string): Promise<void> {
        const cwd = inDir || process.cwd();

        if (context.config.publishConfig.includes("github")) {
            const tgzFile = await utils.npmPack(inDir);
            fs.renameSync(path.join(cwd, tgzFile), path.join("dist", path.basename(tgzFile)));
        }

        const packageJson = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf-8"));
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

    private static async getReleaseNotes(context: IContext): Promise<string | undefined> {
        if (context.config.publishConfig.includes("lerna")) {
            let releaseNotes = "";

            for (const { name, location } of (await utils.lernaList()).filter(pkg => pkg.changed)) {
                const changelogFile = path.join(path.relative(process.cwd(), location), "CHANGELOG.md");
                const packageReleaseNotes = this.getPackageChangelog(changelogFile);
                if (packageReleaseNotes != null) {
                    releaseNotes += `**${name}**\n${packageReleaseNotes}\n\n`;
                }
            }

            return releaseNotes || undefined;
        } else {
            return this.getPackageChangelog("CHANGELOG.md");
        }
    }

    private static getPackageChangelog(changelogFile: string): string | undefined {
        let releaseNotes = "";
    
        if (fs.existsSync(changelogFile)) {
            const changelogLines: string[] = fs.readFileSync(changelogFile, "utf-8").split(/\r?\n/);
            let lineNum = changelogLines.findIndex(line => line.startsWith(`## \`${this.newVersion}\``));
    
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
}
