import * as fs from "fs";
import * as core from "@actions/core";
import { IConfig } from "./doc/IConfig";
import { IProtectedBranch } from "./doc/IProtectedBranch";
import { Publish } from "./publish";
import * as utils from "./utils";
import { Version } from "./version";

async function run(): Promise<void> {
    try {
        const shouldVersion: boolean = core.getInput("skip-version") !== "true";
        const shouldPublishGithub: boolean = core.getInput("github-artifacts") !== "";
        const shouldPublishNpm: boolean = core.getInput("npm-credentials") !== "" && core.getInput("npm-email") !== "";

        const configFile: string = core.getInput("config-file");
        const currentBranch: string = (await utils.execAndReturnOutput("git", ["rev-parse", "--abbrev-ref", "HEAD"])).trim();
        let config: IConfig = {
            protectedBranches: [
                {
                    name: currentBranch
                }
            ]
        };

        if (fs.existsSync(configFile)) {
            config = require("js-yaml").safeLoad(fs.readFileSync(configFile, "utf-8"));
        } else {
            core.warning(`Missing config file ${configFile} so continuing without protected branch rules`);
        }

        const branchNames: string[] = (config.protectedBranches || []).map(branch => branch.name);

        // Check if protected branch is in config
        if (branchNames.indexOf(currentBranch) === -1) {
            core.info(`${currentBranch} is not a protected branch in ${configFile} so exiting now`);
            process.exit();
        }

        const protectedBranch: IProtectedBranch = config.protectedBranches[branchNames.indexOf(currentBranch)];

        if (shouldVersion) {
            await Version.version(protectedBranch);
        }

        if (shouldPublishGithub) {
            await Publish.publishGithub();
        }

        if (shouldPublishNpm) {
            await Publish.publishNpm(protectedBranch);
        }

        if (!shouldPublishGithub && !shouldPublishNpm) {
            core.warning("Nothing to publish");
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
