import * as fs from "fs";
import { IContext } from "@octorelease/core";
import { DEFAULT_NPM_REGISTRY, IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.env.NPM_TOKEN == null) {
        throw new Error("Required environment variable NPM_TOKEN is undefined");
    }

    let publishConfig;
    try {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        context.version.new = packageJson.version;
        publishConfig = packageJson.publishConfig;
    } catch {
        context.logger.warning(`Missing or invalid package.json in branch ${context.branch.name}`);
    }

    context.branch.channel = context.branch.channel || "latest";
    await utils.npmConfig(context, publishConfig?.registry || DEFAULT_NPM_REGISTRY);
}
