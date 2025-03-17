/**
 * Copyright 2020-202X Zowe Actions Contributors
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
import * as glob from "@actions/glob";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    await utils.twineUpload(context, config.distPath);
    const globber = await glob.create(`${config.distPath || "dist"}/*.tar.gz`);
    context.releasedPackages.pypi = [
        ...(context.releasedPackages.pypi || []),
        ...(await globber.glob()).map((tgzPath) => {
            return { name: path.basename(tgzPath, ".tar.gz") };
        })
    ];
}
