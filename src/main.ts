import * as path from "path";
import * as core from "@actions/core";
import { IProtectedBranch } from "./doc";
import * as utils from "./utils/core";
import { Config } from "./config";
import { Publish } from "./publish";
import { Version } from "./version";

async function run(): Promise<void> {
    try {
        const currentBranch: string = (await utils.execAndReturnOutput("git rev-parse --abbrev-ref HEAD")).trim();
        const protectedBranch: IProtectedBranch = (new Config()).getProtectedBranch(currentBranch);
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
            await Publish.prepublish();
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
