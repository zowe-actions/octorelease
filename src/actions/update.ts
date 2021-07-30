import * as fs from "fs";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { IContext, IProtectedBranch } from "../doc";

const updateDetails: string[] = [];

export default async function (context: IContext): Promise<void> {
    const pluralize = require("pluralize");
    const dependencies = getDependencies(context.branch, false);
    const devDependencies = getDependencies(context.branch, true);
    const changedFiles = ["package.json", "package-lock.json"];

    core.info(`Checking for updates to ${pluralize("dependency", Object.keys(dependencies).length, true)} and ` +
        `${pluralize("dev dependency", Object.keys(devDependencies).length, true)}`);

    if (context.branch.dependencies) {
        for (const [pkgName, pkgTag] of Object.entries(dependencies)) {
            await updateDependency(pkgName, pkgTag, false);
        }
    }

    if (context.branch.devDependencies) {
        for (const [pkgName, pkgTag] of Object.entries(devDependencies)) {
            await updateDependency(pkgName, pkgTag, true);
        }
    }

    if (fs.existsSync("lerna.json") && (context.branch.dependencies || context.branch.devDependencies)) {
        changedFiles.push("**/package.json");
        const dependencyList = [...Object.keys(dependencies), ...Object.keys(devDependencies)];

        await exec.exec("npx", ["-y", "--", "syncpack", "fix-mismatches", "--dev", "--prod", "--filter", dependencyList.join("|")]);
        await exec.exec("git", ["checkout", "package-lock.json"]);
        await exec.exec("npm", ["install"]);
    }

    if (updateDetails.length > 0 && core.getBooleanInput("commit-updates")) {
        await exec.exec("git", ["add", ...changedFiles]);
        await exec.exec("git", ["commit", "-s", "-m", "Update dependencies [ci skip]\n\n" + updateDetails.join("\n")]);
    }
}

function getDependencies(branch: IProtectedBranch & { tag: string }, dev: boolean) {
    const dependencies = dev ? branch.devDependencies : branch.dependencies;
    if (!Array.isArray(dependencies)) {
        return dependencies || {};
    }

    const dependencyMap: Record<string, string> = {};
    for (const pkgName of dependencies) {
        dependencyMap[pkgName] = branch.tag;
    }

    return dependencyMap;
}

async function updateDependency(pkgName: string, pkgTag: string, dev: boolean) {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
    const dependencies = packageJson[dev ? "devDependencies" : "dependencies"] || {};
    const currentVersion = dependencies[pkgName];
    const latestVersion = (await exec.getExecOutput("npm", ["view", `${pkgName}@${pkgTag}`, "version"])).stdout.trim();

    if (currentVersion !== latestVersion) {
        const npmArgs = dev ? ["--save-dev"] : ["--save-prod", "--save-exact"];
        await exec.exec("npm", ["install", `${pkgName}@${latestVersion}`, ...npmArgs]);
        updateDetails.push(`${pkgName}: ${currentVersion} -> ${latestVersion}`);
    }
}
