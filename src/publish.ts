import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as glob from "@actions/glob";
import * as exec from "@actions/exec";
import { IProtectedBranch } from "./doc";
import { Changelog } from "./changelog";
import * as utils from "./utils";

/**
 * Type of publish action
 */
export type PublishType = "github" | "npm" | "vsce";

export class Publish {
    public static async prepublish(): Promise<void> {
        // TODO What if prepublish command needs to run in package folders rather than at top-level?
        await utils.execBashCmd(core.getInput("prepublish-cmd"));
    }

    public static async publish(publishType: PublishType, protectedBranch: IProtectedBranch, pkgDir?: string): Promise<void> {
        switch (publishType) {
            case "github":
                return this.publishGithub(pkgDir);
            case "npm":
                return this.publishNpm(protectedBranch, pkgDir);
            case "vsce":
                return this.publishVsce(pkgDir);
        }
    }

    private static async publishGithub(pkgDir?: string): Promise<void> {
        const [owner, repo] = utils.requireEnvVar("GITHUB_REPOSITORY").split("/", 2);
        const packageJson = JSON.parse(fs.readFileSync(utils.prependPkgDir("package.json", pkgDir), "utf-8"));

        // Create release and add release notes if any
        const octokit = github.getOctokit(core.getInput("repo-token"));
        const releaseNotes = Changelog.getReleaseNotes(utils.prependPkgDir("CHANGELOG.md", pkgDir), packageJson.version);
        let release;

        try {
            release = await octokit.repos.createRelease({
                owner, repo,
                tag_name: `v${packageJson.version}`,
                body: releaseNotes
            });
        } catch (err) {
            if (err.message.includes("already_exists")) {
                // TODO Don't fail if release already exists
                // Should continue, but check for artifacts that already exist and don't overwrite them
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

    private static async publishNpm(branch: IProtectedBranch, pkgDir?: string): Promise<void> {
        const packageJson = JSON.parse(fs.readFileSync(utils.prependPkgDir("package.json", pkgDir), "utf-8"));
        const npmRegistry: string | undefined = core.getInput("npm-registry") || packageJson.publishConfig?.registry;
        let npmScope: string | undefined = undefined;

        if (!npmRegistry) {
            core.setFailed("Expected NPM registry to be defined in package.json but it is not");
            process.exit();
        }

        if (packageJson.name.includes("/")) {
            npmScope = packageJson.name.split("/")[0];
        }

        utils.npmConfig(npmRegistry, npmScope);

        try {
            // Publish package
            const alreadyPublished = await utils.npmViewVersion(packageJson.name, packageJson.version);
            if (!alreadyPublished) {
                await utils.execInDir(`npm publish --tag ${branch.tag || "latest"}`, pkgDir);
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

    private static async publishVsce(pkgDir?: string): Promise<void> {
        const packageJson = JSON.parse(fs.readFileSync(utils.prependPkgDir("package.json", pkgDir), "utf-8"));
        const vsceMetadata = await utils.execAndReturnOutput("npx", ["vsce", "show", `${packageJson.publisher}.${packageJson.name}`, "--json"]);

        const latestVersion = packageJson.version;
        const publishedVersion = JSON.parse(vsceMetadata).versions[0]?.version;

        // Publish extension
        if (publishedVersion !== latestVersion) {
            const vsceToken = core.getInput("vsce-token");
            await utils.execInDir(`npx vsce publish -p ${vsceToken}`, pkgDir);
        } else {
            core.error(`Version ${packageJson.version} has already been published to VS Code Marketplace`);
        }
    }
}
