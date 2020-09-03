import * as fs from "fs";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as github from "@actions/github";
import { ISemVerInfo } from "./doc";
import * as utils from "./utils";
import { Project } from "./project";

export class SemVer {
    public static async getSemVerInfo(pkgVer?: string): Promise<ISemVerInfo | undefined> {
        return (pkgVer != null) ? this.getSemVerInfoFromPackageJson(pkgVer) : this.getSemVerInfoFromPRLabel();
    }

    private static async getSemVerInfoFromPackageJson(newPkgVer: string): Promise<ISemVerInfo | undefined> {
        const eventPath: string = utils.requireEnvVar("GITHUB_EVENT_PATH");
        const eventData = JSON.parse(fs.readFileSync(eventPath).toString());
        const jsonWithVersion = (Project.projectType === "lerna") ? "lerna.json" : "package.json";
        let oldPackageJson: any = {};

        // Load old package.json from base ref
        try {
            await exec.exec(`git fetch origin ${eventData.before}`);
            const cmdOutput = await utils.execAndReturnOutput("git", ["--no-pager", "show", `${eventData.before}:${jsonWithVersion}`]);
            oldPackageJson = JSON.parse(cmdOutput);
        } catch {
            core.warning(`Missing or invalid ${jsonWithVersion} in commit ${eventData.before}`);
            return;
        }

        if (oldPackageJson.version === newPkgVer) {
            core.warning(`Version in ${jsonWithVersion} did not change so skipping version stage`);
            return { level: "none" };
        } else {
            const semverDiff = require("semver-diff");
            return {
                level: semverDiff(oldPackageJson.version, newPkgVer),
                newVersion: newPkgVer
            };
        }
    }

    private static async getSemVerInfoFromPRLabel(): Promise<ISemVerInfo | undefined> {
        const gitHash: string = utils.requireEnvVar("GITHUB_SHA");
        const [owner, repo] = utils.requireEnvVar("GITHUB_REPOSITORY").split("/", 2);

        const octokit = github.getOctokit(core.getInput("repo-token"));
        const prs = await octokit.repos.listPullRequestsAssociatedWithCommit({
            owner, repo,
            commit_sha: gitHash
        });

        if (prs.data.length === 0) {
            core.warning(`Could not find pull request associated with commit ${gitHash}`);
            return;
        }

        const [labelMajor, labelMinor, labelPatch] = core.getInput("semver-labels").split(",", 3).map(s => s.trim());
        const labels = await octokit.issues.listLabelsOnIssue({
            owner, repo,
            issue_number: prs.data[0].number
        });
        const labelNames = labels.data.map(label => label.name);
        const semverInfo: ISemVerInfo = { level: "none" };

        if (labelNames.includes(labelMajor)) {
            semverInfo.level = "major";
        } else if (labelNames.includes(labelMinor)) {
            semverInfo.level = "minor";
        } else if (labelNames.includes(labelPatch)) {
            semverInfo.level = "patch";
        } else {
            core.warning("Semver label was not set on PR so skipping version stage");
        }

        return semverInfo;
    }
}
