import * as fs from "fs";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { IProtectedBranch } from "./doc/IProtectedBranch";
import * as utils from "./utils";

async function updateDependency(pkgName: string, pkgTag: string, packageJson: any, dev: boolean): Promise<void> {
    const dependencies = packageJson[dev ? "devDependencies" : "dependencies"] || {};
    let currentVersion: string = dependencies[pkgName];
    if (currentVersion && !(currentVersion[0] >= "0" && currentVersion[0] <= "9")) {
        currentVersion = currentVersion.slice(1);
    }

    const latestVersion: string = (await utils.execAndReturnOutput("npm", ["view", `${pkgName}@${pkgTag}`, "version"])).trim();

    if (currentVersion !== latestVersion) {
        const npmArgs = dev ? "--save-dev" : "--save-prod --save-exact";
        await exec.exec(`npm install ${pkgName}@${latestVersion} ${npmArgs}`);

        await exec.exec(`git add package.json package-lock.json`);
        await utils.gitCommit(`Bump ${pkgName} from ${currentVersion} to ${latestVersion}`);
    }
}

export async function version(branch: IProtectedBranch): Promise<void> {
    const eventPath: string = utils.requireEnvVar("GITHUB_EVENT_PATH");
    const eventData = JSON.parse(fs.readFileSync(eventPath).toString());
    let cmdOutput: string;
    let oldPackageJson: any = {};

    try {
        await exec.exec(`git fetch origin ${eventData.before}`);
        cmdOutput = await utils.execAndReturnOutput("git", ["--no-pager", "show", `${eventData.before}:package.json`]);
        oldPackageJson = JSON.parse(cmdOutput);
    } catch {
        core.warning(`Missing or invalid package.json in commit ${eventData.before}`);
    }

    const newPackageJson = JSON.parse(fs.readFileSync("package.json").toString());

    if (oldPackageJson.version !== newPackageJson.version) {
        // Check semver level to see if new version is ok
        if (branch.level && branch.level !== "major" && oldPackageJson.version) {
            const semverDiff = require("semver-diff");  // eslint-disable-line @typescript-eslint/no-var-requires
            const semverLevel = semverDiff(oldPackageJson.version, newPackageJson.version);

            if (semverLevel === "major" || (semverLevel === "minor" && branch.level !== "minor")) {
                core.setFailed(`Protected branch ${branch.name} does not allow ${semverLevel} version changes`);
                process.exit();
            }
        }

        // Update dependencies in package.json and package-lock.json
        if (branch.dependencies) {
            for (const pkgName of Object.keys(branch.dependencies)) {
                await updateDependency(pkgName, branch.dependencies[pkgName], newPackageJson, false);
            }
        }

        // Update dev dependencies in package.json and package-lock.json
        if (branch.devDependencies) {
            for (const pkgName of Object.keys(branch.devDependencies)) {
                await updateDependency(pkgName, branch.devDependencies[pkgName], newPackageJson, true);
            }
        }

        // Update changelog
        const changelogFile = "CHANGELOG.md";
        const changelogHeader = "## Recent Changes";
        const changelogContents: string = fs.readFileSync(changelogFile).toString();
        if (changelogContents.indexOf("## `" + newPackageJson.version + "`") !== -1) {
            if (changelogContents.indexOf(changelogHeader) !== -1) {
                await exec.exec("sed -i 's/" + changelogHeader + "/## `" + newPackageJson.version + "`/' " + changelogFile);
                await exec.exec(`git add ${changelogFile}`);
            } else {
                core.warning(`Could not find ${changelogHeader} header in changelog`);
            }
        }

        // Update version number in package-lock.json and add Git tag
        await exec.exec(`npm version ${newPackageJson.version}`);

        // Push commits and tag
        utils.gitPush(branch.name, true);
    } else {
        core.info(`Version in package.json did not change so exiting now`);
        process.exit();
    }
}
