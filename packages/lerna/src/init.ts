import * as fs from "fs";
import { IContext } from "@octorelease/core";
import { DEFAULT_NPM_REGISTRY, utils as npmUtils } from "@octorelease/npm";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.env.NPM_TOKEN == null) {
        throw new Error("Required environment variable NPM_TOKEN is undefined");
    }

    let publishConfig;
    try {
        const lernaJson = JSON.parse(fs.readFileSync("lerna.json", "utf-8"))
        context.version.new = lernaJson.version;
        publishConfig = lernaJson.publish;
    } catch {
        context.logger.warning(`Missing or invalid lerna.json in branch ${context.branch.name}`);
    }

    try {
        context.workspaces = JSON.parse(fs.readFileSync("package.json", "utf-8")).workspaces;
    } catch {
        context.logger.warning(`Missing or invalid package.json in branch ${context.branch.name}`);
    }

    context.branch.channel = context.branch.channel || "latest";
    await npmUtils.npmConfig(context, publishConfig?.registry || DEFAULT_NPM_REGISTRY);
}
