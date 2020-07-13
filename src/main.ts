import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import { IConfig } from "./doc/IConfig";
import { IProtectedBranch } from "./doc/IProtectedBranch";
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
                    name: currentBranch
                }
            ]
        };

        if (fs.existsSync(configFile)) {
            config = require("js-yaml").safeLoad(fs.readFileSync(configFile, "utf-8"));
        } else {
            core.warning(`Config file ${configFile} not found so continuing with default config`);
        }

        const branchNames: string[] = (config.protectedBranches || []).map(branch => branch.name);

        // Check if protected branch is in config
        if (branchNames.indexOf(currentBranch) === -1) {
            core.info(`${currentBranch} is not a protected branch in ${configFile} so exiting now`);
            process.exit();
        }

        const protectedBranch: IProtectedBranch = config.protectedBranches[branchNames.indexOf(currentBranch)];
        const rootDir = core.getInput("root-dir");

        if (rootDir) {
            process.chdir(path.resolve(process.cwd(), rootDir));
        }

        if (core.getInput("skip-version") !== "true") {
            await Version.version(protectedBranch);
        }

        const publishJobs: { [key: string]: boolean } = {
            github: core.getInput("github-artifacts") !== "",
            npm: core.getInput("npm-token") !== "",
            vsce: core.getInput("vsce-token") !== ""
        };

        if (Object.keys(publishJobs).filter(publishType => publishJobs[publishType]).length > 0) {
            await utils.execCommands(core.getInput("prepublish-cmds"));
        } else {
            core.warning("Nothing to publish");
        }

        for (const publishType of Object.keys(publishJobs)) {
            if (publishJobs[publishType]) {
                await Publish.publish(publishType as any, protectedBranch);
            }
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
