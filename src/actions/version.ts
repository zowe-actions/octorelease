import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as github from "@actions/github";
import { IContext } from "../doc/IContext";
import * as utils from "../utils";

export default async function (context: IContext): Promise<void> {
    const jsonFile = context.isMonorepo ? "lerna.json" : "package.json";
    const currentVersion: string = JSON.parse(fs.readFileSync(jsonFile, "utf-8")).version;
    const semverLevel = await checkPrForSemverLabel() || await comparePackageJsonSemver(currentVersion);
    let newVersion = require("semver").inc(currentVersion, semverLevel as any) || currentVersion;

    if (context.branch.prerelease) {
        const prereleaseName = (typeof context.branch.prerelease === "string") ? context.branch.prerelease : context.branch.name;
        const timestamp = (new Date()).toISOString().replace(/\D/g, "").slice(0, 12);
        newVersion = `${newVersion.split("-")[0]}-${prereleaseName}.${timestamp}`;
    }

    if ((semverLevel === "major" && (context.branch.level === "minor" || context.branch.level === "patch")) ||
            (semverLevel === "minor" && context.branch.level === "patch")) {
        throw new Error(`Protected branch ${context.branch.name} does not allow ${semverLevel} version changes`);
    }

    const changedFiles = ["package.json", "package-lock.json"];

    if (context.isMonorepo) {
        await utils.lernaVersion(newVersion);
        changedFiles.push("lerna.json");

        for (const { location } of (await utils.lernaList()).filter(pkg => pkg.changed)) {
            const pkgRoot = path.relative(process.cwd(), location);
            changedFiles.push(`${pkgRoot}/package.json`);

            if (core.getBooleanInput("update-changelog")) {
                const changelogFile = path.join(pkgRoot, "CHANGELOG.md");
                updateChangelog(changelogFile, newVersion);
                changedFiles.push(`${pkgRoot}/CHANGELOG.md`);
            }
        }
    } else {
        await utils.npmVersion(newVersion);

        if (core.getBooleanInput("update-changelog")) {
            updateChangelog("CHANGELOG.md", newVersion);
            changedFiles.push("CHANGELOG.md");
        }
    }

    utils.gitConfig();
    await utils.gitAdd(...changedFiles);
    await utils.gitCommit(`Bump version to ${newVersion}`);
    await utils.gitTag(`v${newVersion}`, `Release ${newVersion} to ${context.branch.tag}`);
    await utils.gitPush(context.branch.name, true);
}

async function checkPrForSemverLabel(): Promise<string | null> {
    const octokit = github.getOctokit(core.getInput("github-token"));
    const prs = await octokit.repos.listPullRequestsAssociatedWithCommit({
        ...github.context.repo,
        commit_sha: github.context.sha
    });

    if (prs.data.length === 0) {
        core.warning(`Could not find pull request associated with commit ${github.context.sha}`);
        return null;
    }

    const prNumber = prs.data[0].number;
    core.saveState("pr-number", prNumber);
    const labels = await octokit.issues.listLabelsOnIssue({
        ...github.context.repo,
        issue_number: prNumber
    });
    const releaseLabels = labels.data.filter(label => label.name.startsWith("release-"));

    if (releaseLabels.length > 1) {
        throw new Error("Detected multiple semver labels on pull request, there should only be one");
    }

    switch (releaseLabels[0]?.name) {
        case "release-major":
            return "major";
        case "release-minor":
            return "minor";
        case "release-patch":
            return "patch";
        default:
            core.warning("Could not find semver label on pull request");
            return null;
    }
}

async function comparePackageJsonSemver(currentVersion: string): Promise<string | null> {
    const baseCommitSha = github.context.payload.before;
    let oldPackageJson: any = {};

    try {
        await exec.exec(`git fetch origin ${baseCommitSha}`);
        const cmdOutput = (await exec.getExecOutput("git", ["--no-pager", "show", `${baseCommitSha}:package.json`])).stdout;
        oldPackageJson = JSON.parse(cmdOutput);
    } catch {
        core.warning(`Missing or invalid package.json in commit ${baseCommitSha}`);
        return null;
    }

    const semverDiff = require("semver-diff");
    return semverDiff(oldPackageJson.version, currentVersion) || null;
}

function updateChangelog(changelogFile: string, newVersion: string): void {
    if (fs.existsSync(changelogFile)) {
        const oldContents = fs.readFileSync(changelogFile, "utf-8");
        const searchValue = "## Recent Changes";
        const replaceValue = `## \`${newVersion}\``;
        const newContents = oldContents.replace(searchValue, replaceValue);

        if (newContents !== oldContents) {
            fs.writeFileSync(changelogFile, newContents);
            core.info(`Updated version header in ${changelogFile}`)
        }
    }
}
