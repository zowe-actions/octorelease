import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    const commitMessage = config.commitMessage || "Bump version to {{version}}";
    let tagMessage = config.tagMessage || (context.branch.channel && `Release {{version}} to ${context.branch.channel}`);

    if (context.version.new != null) {
        await utils.gitAdd(...context.changedFiles);

        if (!(await utils.gitCommit(commitMessage.replace("{{version}}", context.version.new)))) {
            context.logger.warning("Nothing to commit");
        }

        tagMessage = tagMessage?.replace("{{version}}", context.version.new);
        if (!(await utils.gitTag(context.tagPrefix + context.version.new, tagMessage))) {
            context.logger.warning("Git tag already exists");
        }

        if (!(await utils.gitPush(context, context.branch.name, true))) {
            context.logger.warning("Nothing to push");
        }
    }
}
