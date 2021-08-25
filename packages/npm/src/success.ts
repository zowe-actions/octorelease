import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as github from "@actions/github";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (config.smokeTest) {
        for (const { name, version, registry } of (context.releasedPackages.npm || [])) {
            const tmpDir = path.join(os.tmpdir(), github.context.runId.toString(), name);
            fs.mkdirSync(tmpDir, { recursive: true });
            await utils.npmInstall(name, version, registry, tmpDir);
            fs.rmdirSync(tmpDir, { recursive: true });
        }
    }
}
