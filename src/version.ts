import * as fs from "fs";
import * as core from "@actions/core";
import { IProtectedBranch } from "./doc/IProtectedBranch";
import * as utils from "./utils";

export async function version(protectedBranch: IProtectedBranch): Promise<void> {
    const eventPath = utils.requireEnvVar("GITHUB_EVENT_PATH");
    const eventData = JSON.parse(fs.readFileSync(eventPath).toString());
    let oldPackageJson: any = {};

    try {
        const cmdOutput = await utils.execAndReturnOutput("git", ["show", "--no-pager", `${eventData.before}:package.json`]);
        oldPackageJson = JSON.parse(cmdOutput);
    } catch {
        core.warning(`Missing or invalid package.json at ${eventData.before}`);
    }

    const newPackageJson = JSON.parse(fs.readFileSync("package.json").toString());

    if (oldPackageJson.version !== newPackageJson.version) {
        // Check semver level to see if new version is ok
        if (protectedBranch.level && protectedBranch.level !== "major" && oldPackageJson.version) {
            const semverDiff = require("semver-diff");  // eslint-disable-line @typescript-eslint/no-var-requires
            const semverLevel = semverDiff(oldPackageJson.version, newPackageJson.version);

            if (semverLevel === "major" || (semverLevel === "minor" && protectedBranch.level !== "minor")) {
                core.setFailed(`Protected branch ${protectedBranch.name} does not allow ${semverLevel} version changes`);
                process.exit();
            }
        }

        // Update dependencies in package.json and package-lock.json

        // Update changelog
    }
}
