import { IContext } from "../../doc";
import { IPluginConfig } from "../npm/config";
import { default as npmPublish } from "../npm/publish";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    for (const { location } of await utils.lernaList()) {
        // TODO Support Yarn publish as alternative option
        await npmPublish(context, config, location);
    }
}
