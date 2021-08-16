import { IContext } from "../../doc";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (context.env.GIT_COMMITTER_NAME == null) {
        throw new Error("Required environment variable GIT_COMMITTER_NAME is undefined");
    }

    if (context.env.GIT_COMMITTER_EMAIL == null) {
        throw new Error("Required environment variable GIT_COMMITTER_EMAIL is undefined");
    }
}
