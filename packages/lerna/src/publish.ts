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

import { IContext } from "@octorelease/core";
import { publish as npmPublish } from "@octorelease/npm";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    for (const { name, location } of await utils.lernaList()) {
        const tempConfig = { ...config };
        if (Array.isArray(config.pruneShrinkwrap)) {
            tempConfig.pruneShrinkwrap = config.pruneShrinkwrap.includes(name);
        }
        await npmPublish(context, tempConfig, location);
    }
}
