import * as path from "path";
import * as core from "@actions/core";
import { IProtectedBranch } from "./doc";
import * as utils from "./utils/core";
import { Config } from "./config";
import { Project } from "./project";
import { Publish } from "./publish";
import { Version } from "./version";

async function run(): Promise<void> {
    try {
        utils.exitIfCiSkip(core.getInput("ci-skip-phrase"));

        const protectedBranch: IProtectedBranch = await (new Config()).getProtectedBranch();
        const rootDir = core.getInput("root-dir");
        const versionStrategy = core.getInput("version-strategy");

        if (rootDir) {
            process.chdir(path.resolve(process.cwd(), rootDir));
        }

        await Project.calcChangedPkgInfo();

        if (versionStrategy === "compare" || versionStrategy === "labels") {
            await Version.version(versionStrategy, protectedBranch);
        }

        const publishJobs: { [key: string]: boolean } = {
            github: core.getInput("github-artifacts") !== "",
            npm: core.getInput("npm-token") !== "",
            vsce: core.getInput("vsce-token") !== ""
        };

        if (Object.values(publishJobs).includes(true)) {
            await Publish.prepublish();
        }

        for (const publishType of Object.keys(publishJobs)) {
            if (publishJobs[publishType]) {
                // TODO Publish all packages, not just changed ones
                // Make the publish logic smart enough so it won't overwrite any parts that were already published
                // But continues running to publish anything that failed previously
                for (const pkgInfo of Project.changedPkgInfo) {
                    console.log("about to publish", pkgInfo.path);
                    await Publish.publish(publishType as any, protectedBranch, pkgInfo.path);
                }
            }
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
