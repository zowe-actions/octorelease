import * as fs from "fs";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as github from "@actions/github";
import { IContext } from "../../doc";
import { IPluginConfig } from "../npm/config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.env.NPM_TOKEN == null) {
        throw new Error("Required environment variable NPM_TOKEN is undefined");
    }

    const baseCommitSha = github.context.payload.before;

    try {
        await exec.exec(`git fetch origin ${baseCommitSha}`);
        const cmdOutput = await exec.getExecOutput("git", ["--no-pager", "show", `${baseCommitSha}:lerna.json`]);
        context.version.old = JSON.parse(cmdOutput.stdout).version;
    } catch {
        core.warning(`Missing or invalid lerna.json in commit ${baseCommitSha}`);
    }

    try {
        context.version.new = JSON.parse(fs.readFileSync("lerna.json", "utf-8")).version;
    } catch {
        core.warning(`Missing or invalid lerna.json in branch ${context.branch.name}`);
    }

    try {
        context.workspaces = JSON.parse(fs.readFileSync("package.json", "utf-8")).workspaces;
    } catch {
        core.warning(`Missing or invalid package.json in branch ${context.branch.name}`);
    }
}
