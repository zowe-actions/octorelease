import * as path from "path";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.version.new != null) {
        const packageInfo = await utils.lernaList(true);
        await utils.lernaVersion(context.version.new);
        context.changedFiles.push("lerna.json", "package.json", "package-lock.json");
        for (const { location } of packageInfo) {
            const relLocation = path.relative(process.cwd(), location);
            context.changedFiles.push(path.join(relLocation, "package.json"));
        }
    }
}
