import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as exec from "@actions/exec";
import { IProtectedBranch } from "./doc/IProtectedBranch";
import * as utils from "./utils";

export async function publishGithub(): Promise<void> {
    const changelogFile = "CHANGELOG.md";
    const packageJson = JSON.parse(fs.readFileSync("package.json").toString());
    let releaseNotes = "";

    // Try to find release notes in changelog
    if (fs.existsSync(changelogFile)) {
        const changelogLines: string[] = fs.readFileSync(changelogFile).toString().split(/\r?\n/);

        let lineNum = changelogLines.indexOf("## `" + packageJson.version + "`");
        if (lineNum !== -1) {
            while ((changelogLines[lineNum + 1] != null) && !changelogLines[lineNum + 1].startsWith("##")) {
                lineNum++;
                releaseNotes += changelogLines[lineNum] + "\n";
            }
        } else {
            core.warning(`Missing changelog header for version ${packageJson.version}`);
        }
    } else {
        core.warning("Missing changelog file");
    }

    const octokit = github.getOctokit(core.getInput("repo-token"));
    const [owner, repo] = utils.requireEnvVar("GITHUB_REPOSITORY").split("/", 2);

    // Create release and add release notes if any
    const release = await octokit.repos.createRelease({
        owner, repo,
        tag_name: "v" + packageJson.version,
        body: releaseNotes.trim() || undefined
    })

    // Upload artifacts to release
    const artifactPaths: string[] = [];
    const glob = require("glob");
    const mime = require("mime-types");
    core.getInput("github-artifacts").split(",").forEach((artifactPattern) => {
        artifactPaths.push(...glob.sync(artifactPattern));
    });
    for (const artifactPath of artifactPaths.map(s => s.trim())) {
        await octokit.repos.uploadReleaseAsset({
            owner, repo,
            release_id: release.data.id,
            name: path.basename(artifactPath),
            data: fs.readFileSync(artifactPath).toString(),
            url: release.data.upload_url,
            headers: {
                "Content-Type": mime.lookup(artifactPath)
            }
        })
    }
}

export async function publishNpm(branch: IProtectedBranch): Promise<void> {
    // Prevent publish from being affected by local npmrc
    await exec.exec("rm -f .npmrc");

    const packageJson = JSON.parse(fs.readFileSync("package.json").toString());
    // Need to remove trailing slash from registry URL for npm-cli-login
    const npmRegistry = packageJson.publishConfig?.registry?.replace(/\/$/, "");

    if (!npmRegistry) {
        core.setFailed("Expected NPM registry to be defined in package.json but it is not");
        process.exit();
    }

    // Login to registry in global npmrc
    const npmLogin = require("npm-cli-login");
    const [npmUsername, npmPassword] = core.getInput("npm-credentials").split(":", 2);
    const npmEmail = core.getInput("npm-email");
    const npmScope = packageJson.name.split("/")[0];
    npmLogin(npmUsername, npmPassword, npmEmail, npmRegistry, npmScope);

    const publishedVersion = await utils.getPackageVersion(packageJson.name, branch.tag);
    const latestVersion = packageJson.version;

    // Publish package
    if (publishedVersion != latestVersion) {
        await exec.exec(`npm publish --tag ${branch.tag}`);
    } else {
        core.warning(`Version ${publishedVersion} has already been published, skipping publish`);
    }

    // Add alias tags
    if (branch.aliasTags) {
        for (const tag of branch.aliasTags) {
            await exec.exec(`npm dist-tag add ${packageJson.name}@${latestVersion} ${tag}`);
        }
    }
}
