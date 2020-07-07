import * as fs from "fs";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as github from "@actions/github";
import { IProtectedBranch } from "./doc/IProtectedBranch";
import { Changelog } from "./changelog";
import * as utils from "./utils";

/**
 * Type to hold level of difference between semantic versions.
 */
type SemVerLevel = "major" | "minor" | "patch" | "none";

export class Version {
    public static async version(branch: IProtectedBranch): Promise<void> {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        const semverLevel: SemVerLevel = await this.getSemVerLevel();

        if (semverLevel === "none") {
            core.warning("Semver label was not set on PR so skipping version stage");
            return;
        }

        // Check semver level to see if new version is ok
        if (branch.level && branch.level !== "major") {
            if (semverLevel === "major" || (semverLevel === "minor" && branch.level === "patch")) {
                core.setFailed(`Protected branch ${branch.name} does not allow ${semverLevel} version changes`);
                process.exit();
            }
        }

        // Configure Git user, email, and origin URL
        await utils.gitConfig();

        // Update dependencies in package.json and package-lock.json
        if (branch.dependencies) {
            for (const pkgName of Object.keys(branch.dependencies)) {
                await this.updateDependency(pkgName, branch.dependencies[pkgName], packageJson, false);
            }
        }

        // Update dev dependencies in package.json and package-lock.json
        if (branch.devDependencies) {
            for (const pkgName of Object.keys(branch.devDependencies)) {
                await this.updateDependency(pkgName, branch.devDependencies[pkgName], packageJson, true);
            }
        }

        // Update version number in package-lock.json and changelog
        await exec.exec("git reset --hard");
        const gitTag = (await utils.execAndReturnOutput(`npm version ${semverLevel} --allow-same-version --no-git-tag-version`)).trim();
        const newVersion = gitTag.slice(1);
        Changelog.updateLatestVersion("CHANGELOG.md", newVersion);

        // Commit version bump and create tag
        await exec.exec("git add -u");
        await utils.gitCommit(`Bump version to ${newVersion}`);
        await exec.exec(`git tag ${gitTag} -m "Release ${newVersion} to ${branch.tag}"`);

        // Push commits and tag
        await utils.gitPush(branch.name, true);
    }

    private static async getSemVerLevel(): Promise<SemVerLevel> {
        const gitHash: string = utils.requireEnvVar("GITHUB_SHA");
        const [owner, repo] = utils.requireEnvVar("GITHUB_REPOSITORY").split("/", 2);

        const octokit = github.getOctokit(core.getInput("repo-token"));
        const prs = await octokit.repos.listPullRequestsAssociatedWithCommit({
            owner, repo,
            commit_sha: gitHash
        });

        if (prs.data.length === 0) {
            core.warning(`Could not find pull request associated with commit ${gitHash}`);
            return "none";
        }

        const [labelMajor, labelMinor, labelPatch] = core.getInput("semver-labels").split(",", 3).map(s => s.trim());
        let semverLevel: SemVerLevel = "none";

        const labels = await octokit.issues.listLabelsOnIssue({
            owner, repo,
            issue_number: prs.data[0].number
        });
        const labelNames = labels.data.map(label => label.name);

        if (labelNames.indexOf(labelMajor) !== -1) {
            semverLevel = "major";
        } else if (labelNames.indexOf(labelMinor) !== -1) {
            semverLevel = "minor";
        } else if (labelNames.indexOf(labelPatch) !== -1) {
            semverLevel = "patch";
        }

        return semverLevel;
    }

    /**
     * Update a Node.js dependency or dev dependency to the latest version released
     * with the specified tag. If there is an update available, the version bump is
     * Git committed.
     * @param pkgName - Name of the dependency (e.g., `@zowe/imperative`)
     * @param pkgTag - Tag of the dependency (e.g., `zowe-v1-lts`)
     * @param packageJson - Package JSON object that contains dependency lists
     * @param dev - Specify true if the package is a dev dependency
     */
    private static async updateDependency(pkgName: string, pkgTag: string, packageJson: any, dev: boolean): Promise<void> {
        const dependencies = packageJson[dev ? "devDependencies" : "dependencies"] || {};
        let currentVersion: string = dependencies[pkgName];
        if (currentVersion) {
            currentVersion = require("semver").clean(currentVersion);
        }

        const latestVersion = await utils.getPackageVersion(pkgName, pkgTag);

        if (currentVersion !== latestVersion) {
            const npmArgs = dev ? "--save-dev" : "--save-prod --save-exact";
            await exec.exec(`npm install ${pkgName}@${latestVersion} ${npmArgs}`);

            await exec.exec(`git add package.json package-lock.json`);
            await utils.gitCommit(`Bump ${pkgName} from ${currentVersion} to ${latestVersion}`);
        }
    }
}
