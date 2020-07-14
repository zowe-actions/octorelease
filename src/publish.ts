import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as glob from "@actions/glob";
import * as exec from "@actions/exec";
import { IProtectedBranch } from "./doc";
import { Changelog } from "./changelog";
import * as utils from "./utils";

type PublishType = "github" | "npm" | "vsce";

export class Publish {
    public static async prepublish(): Promise<void> {
        await utils.execBashCmd(core.getInput("prepublish-cmd"));
    }

    public static async publish(publishType: PublishType, protectedBranch: IProtectedBranch): Promise<void> {
        switch (publishType) {
            case "github":
                return this.publishGithub();
            case "npm":
                return this.publishNpm(protectedBranch);
            case "vsce":
                return this.publishVsce();
        }
    }

    private static async publishGithub(): Promise<void> {
        const [owner, repo] = utils.requireEnvVar("GITHUB_REPOSITORY").split("/", 2);
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

        // Create release and add release notes if any
        const octokit = github.getOctokit(core.getInput("repo-token"));
        const releaseNotes = Changelog.getReleaseNotes("CHANGELOG.md", packageJson.version);
        let release;

        try {
            release = await octokit.repos.createRelease({
                owner, repo,
                tag_name: `v${packageJson.version}`,
                body: releaseNotes
            });
        } catch (err) {
            if (err.message.indexOf("already_exists") !== -1) {
                core.error(`Version ${packageJson.version} has already been published to GitHub`);
                return;
            } else {
                throw err;
            }
        }

        // Upload artifacts to release
        const globber = await glob.create(core.getInput("github-artifacts"));
        const artifactPaths: string[] = await globber.glob();
        const mime = require("mime-types");

        for (const artifactPath of artifactPaths) {
            core.info(`Uploading release asset ${artifactPath}`);
            await octokit.repos.uploadReleaseAsset({
                owner, repo,
                release_id: release.data.id,
                name: path.basename(artifactPath),
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

    private static async publishNpm(branch: IProtectedBranch): Promise<void> {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        const npmRegistry: string | undefined = core.getInput("npm-registry") || packageJson.publishConfig?.registry;
        let npmScope: string | undefined = undefined;

        if (!npmRegistry) {
            core.setFailed("Expected NPM registry to be defined in package.json but it is not");
            process.exit();
        }

        if (packageJson.name.indexOf("/") !== -1) {
            npmScope = packageJson.name.split("/")[0];
        }

        utils.npmConfig(npmRegistry, npmScope);

        try {
            // Publish package
            const alreadyPublished = await utils.npmViewVersion(packageJson.name, packageJson.version);
            if (!alreadyPublished) {
                await exec.exec(`npm publish --tag ${branch.tag || "latest"}`);
            } else {
                core.error(`Version ${packageJson.version} has already been published to NPM`);
            }

            // Add alias tags
            if (branch.aliasTags) {
                for (const tag of branch.aliasTags) {
                    await exec.exec(`npm dist-tag add ${packageJson.name}@${packageJson.version} ${tag}`);
                }
            }
        } finally {
            utils.npmReset();
        }
    }

    private static async publishVsce(): Promise<void> {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        const vsceMetadata = await utils.execAndReturnOutput("npx", ["vsce", "show", `${packageJson.publisher}.${packageJson.name}`, "--json"]);

        const latestVersion = packageJson.version;
        const publishedVersion = JSON.parse(vsceMetadata).versions[0]?.version;

        // Publish extension
        if (publishedVersion !== latestVersion) {
            const vsceToken = core.getInput("vsce-token");
            await exec.exec(`npx vsce publish -p ${vsceToken}`);
        } else {
            core.error(`Version ${packageJson.version} has already been published to VS Code Marketplace`);
        }
    }
}
