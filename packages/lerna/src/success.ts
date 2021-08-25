import { IContext } from "@octorelease/core";
import { success as npmSuccess } from "@octorelease/npm";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    await npmSuccess(context, config);
}
