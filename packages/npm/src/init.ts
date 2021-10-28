import * as fs from "fs";
import * as exec from "@actions/exec";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.env.NPM_TOKEN == null) {
        throw new Error("Required environment variable NPM_TOKEN is undefined");
    }

    const baseCommitSha = context.ci.payload.before;
    let publishConfig;

    try {
        await exec.exec(`git fetch origin ${baseCommitSha}`);
        const cmdOutput = await exec.getExecOutput("git", ["--no-pager", "show", `${baseCommitSha}:package.json`]);
        context.version.old = JSON.parse(cmdOutput.stdout).version;
    } catch {
        context.logger.warning(`Missing or invalid package.json in commit ${baseCommitSha}`);
    }

    try {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        context.version.new = packageJson.version;
        publishConfig = packageJson.publishConfig;
    } catch {
        context.logger.warning(`Missing or invalid package.json in branch ${context.branch.name}`);
    }

    context.branch.channel = context.branch.channel || "latest";
    await utils.npmConfig(context, publishConfig?.registry || "https://registry.npmjs.org/");
}
