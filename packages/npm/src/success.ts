import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { IContext, utils as coreUtils } from "@octorelease/core";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (config.smokeTest && context.releasedPackages.npm != null) {
        context.logger.info("Performing smoke test, installing released package(s)");

        for (const { name, registry } of context.releasedPackages.npm) {
            const tmpDir = path.join(os.tmpdir(), (context.ci as any).build, name);
            fs.mkdirSync(tmpDir, { recursive: true });
            await coreUtils.dryRunTask(context, `install ${name} from ${registry}`, async () => {
                await utils.npmInstall(name, registry, tmpDir);
            });
            fs.rmdirSync(tmpDir, { recursive: true });
        }
    }
}
