import * as fs from "fs";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { IProtectedBranch } from "./doc/IProtectedBranch";
import * as utils from "./utils";

export async function publishNpm(branch: IProtectedBranch): Promise<void> {
    const npmCredentials = core.getInput("npm-credentials");
    const npmEmail = core.getInput("npm-email");

    if (!npmCredentials || !npmEmail) {
        core.setFailed("Expected NPM credentials and email to be defined but they are not");
        process.exit();
    }

    // Prevent publish from being affected by local npmrc
    await exec.exec("rm -f .npmrc");

    const packageJson = JSON.parse(fs.readFileSync("package.json").toString());

    // Login to registry in global npmrc
    const npmLogin = require("npm-cli-login");  // eslint-disable-line @typescript-eslint/no-var-requires
    const [npmUsername, npmPassword] = npmCredentials.split(":", 2);
    const npmRegistry = core.getInput("npm-registry");
    const npmScope = packageJson.name.split("/")[0];
    npmLogin(npmUsername, npmPassword, npmEmail, npmRegistry, npmScope);

    const publishedVersion: string = (await utils.execAndReturnOutput("npm", ["view", `${packageJson.version}@${branch.tag}`, "version"])).trim();
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
