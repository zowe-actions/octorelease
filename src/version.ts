import * as fs from "fs";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { IProtectedBranch } from "./doc/IProtectedBranch";
import * as utils from "./utils";

export class Version {
    public static async version(branch: IProtectedBranch): Promise<void> {
        const eventPath: string = utils.requireEnvVar("GITHUB_EVENT_PATH");
        const eventData = JSON.parse(fs.readFileSync(eventPath).toString());
        let oldPackageJson: any = {};

        // Load old package.json from base ref
        try {
            await exec.exec(`git fetch origin ${eventData.before}`);
            const cmdOutput = await utils.execAndReturnOutput("git", ["--no-pager", "show", `${eventData.before}:package.json`]);
            oldPackageJson = JSON.parse(cmdOutput);
        } catch {
            core.warning(`Missing or invalid package.json in commit ${eventData.before}`);
        }

        const newPackageJson = JSON.parse(fs.readFileSync("package.json").toString());

        if (oldPackageJson.version !== newPackageJson.version) {
            // Check semver level to see if new version is ok
            if (branch.level && branch.level !== "major" && oldPackageJson.version) {
                const semverDiff = require("semver-diff");
                const semverLevel = semverDiff(oldPackageJson.version, newPackageJson.version);

                if (semverLevel === "major" || (semverLevel === "minor" && branch.level !== "minor")) {
                    core.setFailed(`Protected branch ${branch.name} does not allow ${semverLevel} version changes`);
                    process.exit();
                }
            }

            // Configure Git user, email, and origin URL
            await utils.gitConfig();

            // Update dependencies in package.json and package-lock.json
            if (branch.dependencies) {
                for (const pkgName of Object.keys(branch.dependencies)) {
                    await this.updateDependency(pkgName, branch.dependencies[pkgName], newPackageJson, false);
                }
            }

            // Update dev dependencies in package.json and package-lock.json
            if (branch.devDependencies) {
                for (const pkgName of Object.keys(branch.devDependencies)) {
                    await this.updateDependency(pkgName, branch.devDependencies[pkgName], newPackageJson, true);
                }
            }

            // Update version number in package-lock.json and changelog
            await exec.exec("git reset --hard");
            const gitTag = (await utils.execAndReturnOutput(`npm version ${newPackageJson.version} --allow-same-version --no-git-tag-version`)).trim();
            this.updateChangelog("CHANGELOG.md", newPackageJson.version);

            // Commit version bump and create tag
            await exec.exec("git add -u");
            await utils.gitCommit(`Bump version to ${newPackageJson.version}`);
            await exec.exec(`git tag ${gitTag} -m "Release ${newPackageJson.version} to ${branch.tag}"`);

            // Push commits and tag
            await utils.gitPush(branch.name, true);
        } else {
            core.info(`Version in package.json did not change so exiting now`);
            process.exit();
        }
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
        if (currentVersion && !(currentVersion[0] >= "0" && currentVersion[0] <= "9")) {
            currentVersion = currentVersion.slice(1);
        }

        const latestVersion = await utils.getPackageVersion(pkgName, pkgTag);

        if (currentVersion !== latestVersion) {
            const npmArgs = dev ? "--save-dev" : "--save-prod --save-exact";
            await exec.exec(`npm install ${pkgName}@${latestVersion} ${npmArgs}`);

            await exec.exec(`git add package.json package-lock.json`);
            await utils.gitCommit(`Bump ${pkgName} from ${currentVersion} to ${latestVersion}`);
        }
    }

    /**
     * Update the changelog file, if one exists, to replace the header denoting
     * recent changes with a header for the new version.
     * @param changelogFile - Path to changelog file
     * @param pkgVer - New version of the package
     */
    private static updateChangelog(changelogFile: string, pkgVer: string): void {
        if (!fs.existsSync(changelogFile)) {
            core.warning("Missing changelog file, skipping changelog update");
            return;
        }

        const changelogHeader = core.getInput("changelog-header");
        if (!changelogHeader) {
            core.warning("Changelog header was not defined, skipping changelog update")
            return;
        }

        const changelogContents: string = fs.readFileSync(changelogFile).toString();
        if (changelogContents.indexOf("## `" + pkgVer + "`") !== -1) {
            core.warning(`Changelog header already exists for version ${pkgVer}, skipping changelog update`);
            return;
        }

        if (changelogContents.indexOf(changelogHeader) === -1) {
            core.warning("Changelog header not found in changelog file, skipping changelog update");
            return;
        }

        fs.writeFileSync(changelogFile, changelogContents.replace(/## Recent Changes/, "## `" + pkgVer + "`"));
    }
}
