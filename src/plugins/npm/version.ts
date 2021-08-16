import { IContext } from "../../doc";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.version.new != null) {
        await utils.npmVersion(context.version.new);
        context.changedFiles.push("package.json", "package-lock.json");
    }
}
