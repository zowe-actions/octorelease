import * as fs from "fs";
import * as core from "@actions/core";
import * as yaml from "js-yaml";
import { IConfig } from "./doc/IConfig";
import { IProtectedBranch } from "./doc/IProtectedBranch";
import * as utils from "./utils";
import { version } from "./version";

async function run(): Promise<void> {
    try {
        const eventPath: string = utils.requireEnvVar("GITHUB_EVENT_PATH");
        const eventData = JSON.parse(fs.readFileSync(eventPath).toString());
        const ciSkipPhrase = core.getInput("ciSkipPhrase");

        // Check for CI skip
        if (eventData?.head_commit?.message && eventData.head_commit.message.indexOf(ciSkipPhrase) !== -1) {
            core.info("Commit message contains CI skip phrase so exiting now");
            process.exit();
        }

        const configFile: string = core.getInput("configFile");
        const config: IConfig = yaml.safeLoad(fs.readFileSync(configFile).toString()) as IConfig;
        const branchNames: string[] = (config.protectedBranches || []).map((branch: IProtectedBranch) => branch.name);
        const currentBranch: string = (await utils.execAndReturnOutput("git", ["rev-parse", "--abbrev-ref", "HEAD"])).trim();

        // Check if protected branch is in config
        if (branchNames.indexOf(currentBranch) === -1) {
            core.info(`${currentBranch} is not a protected branch in ${configFile} so exiting now`);
            process.exit();
        }

        const protectedBranch = config.protectedBranches[branchNames.indexOf(currentBranch)];

        if (core.getInput("version") === "true") {
            await version(protectedBranch, eventData);
        }

        if (core.getInput("deploy") === "npm") {
            // await deployNpm(protectedBranch);
        } else if (core.getInput("deploy") === "vsix") {
            // await deployVsix(protectedBranch);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
