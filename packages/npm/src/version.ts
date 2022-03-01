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

import * as path from "path";
import findUp from "find-up";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, _config: IPluginConfig): Promise<void> {
    await utils.npmVersion(context.version.new);
    context.changedFiles.push("package.json");
    const lockfilePath = await findUp(["package-lock.json", "npm-shrinkwrap.json"]);
    if (lockfilePath != null) {
        context.changedFiles.push(path.relative(process.cwd(), lockfilePath));
    } else {
        context.logger.warn("Could not find lockfile to update version in");
    }
}
