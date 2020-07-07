import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as exec from "@actions/exec";
import { IProtectedBranch } from "./doc/IProtectedBranch";
import * as utils from "./utils";

export class Publish {
    public static async publishGithub(): Promise<void> {
        const [owner, repo] = utils.requireEnvVar("GITHUB_REPOSITORY").split("/", 2);
        const packageJson = JSON.parse(fs.readFileSync("package.json").toString());

        // Create release and add release notes if any
        const octokit = github.getOctokit(core.getInput("repo-token"));
        const releaseNotes = await this.getReleaseNotes("CHANGELOG.md", packageJson.version);
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
        const artifactPaths: string[] = [];
        const glob = require("glob");
        core.getInput("github-artifacts").split(",").forEach((artifactPattern) => {
            artifactPaths.push(...glob.sync(artifactPattern.trim()));
        });

        for (const artifactPath of artifactPaths) {
            core.info(`Uploading release asset ${artifactPath}`);
            await octokit.repos.uploadReleaseAsset({
                owner, repo,
                release_id: release.data.id,
                name: path.basename(artifactPath),
                // Need to upload as buffer because converting to string corrupts binary data
                data: fs.readFileSync(artifactPath) as any,
                url: release.data.upload_url,
                headers: this.getUploadRequestHeaders(artifactPath)
            });
        }
    }

    public static async publishNpm(branch: IProtectedBranch): Promise<void> {
        // Prevent publish from being affected by local npmrc
        await exec.exec("rm -f .npmrc");

        const packageJson = JSON.parse(fs.readFileSync("package.json").toString());
        let npmRegistry = core.getInput("npm-registry") || packageJson.publishConfig?.registry;

        if (npmRegistry) {
            // Need to remove trailing slash from registry URL for npm-cli-login
            npmRegistry = npmRegistry.replace(/\/$/, "");
        } else {
            core.setFailed("Expected NPM registry to be defined in package.json but it is not");
            process.exit();
        }

        // Login to registry in global npmrc
        const npmLogin = require("npm-cli-login");
        const [npmUsername, npmPassword] = core.getInput("npm-credentials").split(":", 2);
        const npmEmail = core.getInput("npm-email");
        const npmScope = packageJson.name.split("/")[0];
        npmLogin(npmUsername, npmPassword, npmEmail, npmRegistry, npmScope);

        // Publish package
        const alreadyPublished = await utils.getPackageVersion(packageJson.name, packageJson.version);
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
    }

    /**
     * Try to find release notes in changelog for the version being published.
     * @param changelogFile - Path to changelog file
     * @param pkgVer - Latest version of the package
     */
    private static async getReleaseNotes(changelogFile: string, pkgVer: string): Promise<string | undefined> {
        let releaseNotes = "";

        // Try to find release notes in changelog
        if (fs.existsSync(changelogFile)) {
            const changelogLines: string[] = fs.readFileSync(changelogFile).toString().split(/\r?\n/);

            let lineNum = changelogLines.indexOf("## `" + pkgVer + "`");
            if (lineNum !== -1) {
                while ((changelogLines[lineNum + 1] != null) && !changelogLines[lineNum + 1].startsWith("## ")) {
                    lineNum++;
                    releaseNotes += changelogLines[lineNum] + "\n";
                }
            } else {
                core.warning(`Missing changelog header for version ${pkgVer}`);
            }
        } else {
            core.warning("Missing changelog file");
        }

        return releaseNotes.trim() || undefined;
    }

    private static getUploadRequestHeaders(artifactPath: string): any {
        return {
            "Content-Length": fs.statSync(artifactPath).size,
            "Content-Type": require("mime-types").lookup(artifactPath) || "application/octet-stream"
        };
    }
}
