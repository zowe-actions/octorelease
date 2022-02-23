import * as path from "path";
import findUp from "find-up";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.version.new != null) {
        await utils.npmVersion(context.version.new);
        context.changedFiles.push("package.json");
        const lockfilePath = await findUp(["package-lock.json", "npm-shrinkwrap.json"]);
        if (lockfilePath != null) {
            context.changedFiles.push(path.relative(process.cwd(), lockfilePath));
        } else {
            context.logger.warning("Could not find lockfile to update version in");
        }
    }
}
