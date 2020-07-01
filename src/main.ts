import * as fs from "fs";
import * as core from "@actions/core";
import * as yaml from "js-yaml";
import { IConfig } from "./doc/IConfig";
import { IProtectedBranch } from "./doc/IProtectedBranch";
import * as utils from "./utils";
import { version } from "./version";

async function run(): Promise<void> {
    try {
        const configFile: string = core.getInput("configFile");
        const config: IConfig = yaml.safeLoad(fs.readFileSync(configFile).toString()) as IConfig;

        const branchNames: string[] = (config.protectedBranches || []).map((branch: IProtectedBranch) => branch.name);
        const currentBranch: string = (await utils.execAndReturnOutput("git", ["rev-parse", "--abbrev-ref", "HEAD"])).trim();

        if (branchNames.indexOf(currentBranch) === -1) {
            core.info(`${currentBranch} is not a protected branch in ${configFile} so exiting now`);
            process.exit();
        }

        const protectedBranch = config.protectedBranches[branchNames.indexOf(currentBranch)];

        if (core.getInput("version") === "true") {
            await version(protectedBranch);
        }

        if (core.getInput("deploy") === "true") {
            // await deploy(protectedBranch);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
