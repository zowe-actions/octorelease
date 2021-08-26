import { IContext } from "@octorelease/core";
import { publish as npmPublish } from "@octorelease/npm";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    for (const { location } of await utils.lernaList()) {
        await npmPublish(context, config, location);
    }
}
