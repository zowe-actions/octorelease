import * as fs from "fs";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { IProtectedBranch } from "./doc/IProtectedBranch";
import * as utils from "./utils";

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
    const npmLogin = require("npm-cli-login");  // eslint-disable-line @typescript-eslint/no-var-requires
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

export async function publishVsce(branch: IProtectedBranch): Promise<void> {
    core.setFailed("Not yet implemented");
}
