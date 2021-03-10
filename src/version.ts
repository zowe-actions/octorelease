import * as fs from "fs";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { IProtectedBranch, ISemVerInfo } from "./doc";
import { Changelog } from "./changelog";
import { SemVer } from "./semver";
import * as utils from "./utils";

/**
 * Type of version strategy
 */
export type VersionStrategy = "compare" | "labels";

export class Version {
    public static async version(strategy: VersionStrategy, branch: IProtectedBranch): Promise<void> {
        const semverInfo = await this.beforeVersion(strategy, branch);

        if (!semverInfo) {
            return;
        }

        // Update dependencies across all packages and commit updates
        if (branch.dependencies) {
            for (const [pkgName, pkgTag] of Object.entries(branch.dependencies)) {
                await this.updateDependency(pkgName, pkgTag, false);
            }
        }

        // Update dev dependencies across all packages and commit updates
        if (branch.devDependencies) {
            for (const [pkgName, pkgTag] of Object.entries(branch.devDependencies)) {
                await this.updateDependency(pkgName, pkgTag, true);
            }
        }

        // Update version number in package-lock.json and changelog
        await exec.exec("git reset --hard");
        let newVersion: string = semverInfo.newVersion || semverInfo.level;
        newVersion = await utils.npmVersion(newVersion);
        Changelog.updateLatestVersion("CHANGELOG.md", newVersion);

        // Commit version bump and create tag
        await exec.exec("git add -u");
        await utils.gitCommit(`Bump version to ${newVersion}`);
        await exec.exec(`git tag v${newVersion} -m "Release ${newVersion} to ${branch.tag}"`);

        // Push commits and tag
        await utils.gitPush(branch.name, true);
        core.setOutput("new-version", newVersion);
    }

    private static async beforeVersion(strategy: VersionStrategy, branch: IProtectedBranch): Promise<ISemVerInfo | undefined> {
        const newVersion: string = JSON.parse(fs.readFileSync("package.json", "utf-8")).version;
        const semverInfo = await SemVer.getSemVerInfo((strategy === "compare") ? newVersion : undefined);

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

        return semverInfo;
    }

    /**
     * Update a Node.js dependency or dev dependency to the latest version released
     * with the specified tag. If there is an update available, the version bump is
     * Git committed.
     * @param pkgName - Name of the dependency (e.g., `@zowe/imperative`)
     * @param pkgTag - Tag of the dependency (e.g., `zowe-v1-lts`)
     * @param dev - Specify true if the package is a dev dependency
     */
    private static async updateDependency(pkgName: string, pkgTag: string, dev: boolean): Promise<void> {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
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
