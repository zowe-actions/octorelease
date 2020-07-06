import * as fs from "fs";
import * as core from "@actions/core";
import { IConfig } from "./doc/IConfig";
import { Publish } from "./publish";
import * as utils from "./utils";
import { Version } from "./version";

async function run(): Promise<void> {
    try {
        const configFile: string = core.getInput("config-file");
        const currentBranch: string = (await utils.execAndReturnOutput("git", ["rev-parse", "--abbrev-ref", "HEAD"])).trim();
        let config: IConfig = {
            protectedBranches: [
                {
                    name: currentBranch,
                    tag: "latest"
                }
            ]
        };

        if (fs.existsSync(configFile)) {
            config = require("js-yaml").safeLoad(fs.readFileSync(configFile, "utf-8"));
        } else {
            core.warning(`Missing config file ${configFile} so using default config`);
        }

        const branchNames: string[] = (config.protectedBranches || []).map(branch => branch.name);

        // Check if protected branch is in config
        if (branchNames.indexOf(currentBranch) === -1) {
            core.info(`${currentBranch} is not a protected branch in ${configFile} so exiting now`);
            process.exit();
        }

        const protectedBranch = config.protectedBranches[branchNames.indexOf(currentBranch)];

        if (core.getInput("skip-version") !== "true") {
            await Version.version(protectedBranch);
        }

        let publishJobs = false;

        if (core.getInput("github-artifacts")) {
            publishJobs = true;
            await Publish.publishGithub();
        }

        if (core.getInput("npm-credentials") && core.getInput("npm-email")) {
            publishJobs = true;
            await Publish.publishNpm(protectedBranch);
        }

        if (!publishJobs) {
            core.warning("Nothing to publish");
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
