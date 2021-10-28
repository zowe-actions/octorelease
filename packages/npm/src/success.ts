import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { IContext, utils as coreUtils } from "@octorelease/core";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (config.smokeTest && context.releasedPackages.npm != null) {
        context.logger.info("Performing smoke test, installing released package(s)");

        for (const { name, version, registry } of context.releasedPackages.npm) {
            const tmpDir = path.join(os.tmpdir(), context.ci.runNumber.toString(), name);
            fs.mkdirSync(tmpDir, { recursive: true });
            await coreUtils.dryRunTask(context, `install ${name}@${version} from ${registry}`, async () => {
                await utils.npmInstall(name, version, registry, tmpDir);
            });
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    }
}
