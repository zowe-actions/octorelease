import * as fs from "fs";
import * as core from "@actions/core";
import * as yaml from "js-yaml";
import { IConfig } from "./doc/IConfig";
import { IProtectedBranch } from "./doc/IProtectedBranch";
import { publishNpm, publishVsce } from "./publish";
import * as utils from "./utils";
import { version } from "./version";

async function run(): Promise<void> {
    try {
        const configFile: string = core.getInput("config-file");
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
            await version(protectedBranch);
        }

        if (core.getInput("publish") === "npm") {
            await publishNpm(protectedBranch);
        } else if (core.getInput("publish") === "vsce") {
            await publishVsce(protectedBranch);
        } else {
            core.info("Missing or invalid publish type (allowed values: npm, vsce)");
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
