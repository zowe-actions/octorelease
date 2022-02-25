/**
 * Copyright 2022 Octorelease Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
