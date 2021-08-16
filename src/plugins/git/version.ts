import { IContext } from "../../doc";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    const commitMessage = config.commitMessage || "Bump version to {{version}}";
    const tagMessage = config.tagMessage || `Release {{version}} to ${context.branch.tag}`;

    if (context.version.new != null) {
        await utils.gitConfig(context);
        await utils.gitAdd(...context.changedFiles);
        await utils.gitCommit(commitMessage.replace("{{version}}", context.version.new));
        await utils.gitTag(`v${context.version.new}`, tagMessage.replace("{{version}}", context.version.new));
        await utils.gitPush(context.branch.name, true);
    }
}
