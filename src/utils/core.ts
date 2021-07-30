import * as fs from "fs";
import * as github from "@actions/github";
import { cosmiconfig } from "cosmiconfig";
import { IContext } from "../doc/IContext";

export async function buildContext(): Promise<IContext | undefined> {
    const config = await cosmiconfig("release").search();
    if (config == null || config.isEmpty) {
        throw new Error("Failed to load config because file does not exist or is empty");
    }

    const branchName = github.context.payload.pull_request?.base.ref || github.context.ref.replace(/^refs\/heads\//, "");
    const micromatch = require("micromatch");
    const branch = config.config.branches
        .map((branch: any) => typeof branch === "string" ? { name: branch } : branch)
        .find((branch: any) => micromatch.isMatch(branchName, branch.name));
    if (branch == null) {
        return;
    }
    if (branch.tag == null) {
        branch.tag = ["main", "master"].includes(branchName) ? "latest" : branchName;
    }

    const publishConfig: any = {};
    for (const pc of config.config.publishConfig) {
        if (typeof pc === "string") {
            publishConfig[pc] = {};
        } else {
            publishConfig[pc[0]] = pc[1];
        }
    }

    return {
        branch,
        isMonorepo: fs.existsSync("lerna.json"),
        publishConfig
    };
}
