import * as fs from "fs";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { IProtectedBranch } from "./doc";
import { Changelog } from "./changelog";
import { SemVer } from "./semver";
import * as utils from "./utils";

/**
 * Type of version strategy
 */
export type VersionStrategy = "compare" | "labels";

export class Version {
    public static async version(strategy: VersionStrategy, branch: IProtectedBranch): Promise<void> {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        const semverInfo = await SemVer.getSemVerInfo((strategy === "compare") ? packageJson.version : undefined);

        if (!semverInfo || semverInfo.level === "none") {
            return;
        }

        // Check semver level to see if new version is ok
        if (branch.level && branch.level !== "major") {
            if (semverInfo.level === "major" || (semverInfo.level === "minor" && branch.level === "patch")) {
                core.setFailed(`Protected branch ${branch.name} does not allow ${semverInfo.level} version changes`);
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
        let newVersion: string = semverInfo.newVersion || semverInfo.level;
        const gitTag = (await utils.execAndReturnOutput("npm", ["version", newVersion, "--allow-same-version", "--no-git-tag-version"])).trim();
        newVersion = gitTag.slice(1);
        Changelog.updateLatestVersion("CHANGELOG.md", newVersion);

        // Commit version bump and create tag
        await exec.exec("git add -u");
        await utils.gitCommit(`Bump version to ${newVersion}`);
        await exec.exec(`git tag ${gitTag} -m "Release ${newVersion} to ${branch.tag}"`);

        // Push commits and tag
        await utils.gitPush(branch.name, true);
        core.setOutput("new-version", newVersion);
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
        const currentVersion: string = dependencies[pkgName];

        const latestVersion = await utils.npmViewVersion(pkgName, pkgTag);

        if (currentVersion !== latestVersion) {
            const npmArgs = dev ? "--save-dev" : "--save-prod --save-exact";
            await exec.exec(`npm install ${pkgName}@${latestVersion} ${npmArgs}`);

            await exec.exec(`git add package.json package-lock.json`);
            await utils.gitCommit(`Bump ${pkgName} from ${currentVersion} to ${latestVersion}`);
        }
    }
}
