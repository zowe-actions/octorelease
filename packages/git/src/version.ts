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

import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    const commitMessage = config.commitMessage || "Bump version to {{version}}";
    let tagMessage = config.tagMessage || (context.branch.channel &&
        `Release {{version}} to ${context.branch.channel}`);

    await utils.gitAdd(...new Set(context.changedFiles));
    let shouldPush = false;

    if (await utils.gitCommit(commitMessage.replace("{{version}}", context.version.new))) {
        shouldPush = true;
    } else {
        context.logger.warn("Nothing to commit");
    }

    tagMessage = tagMessage?.replace("{{version}}", context.version.new);
    if (await utils.gitTag(context.tagPrefix + context.version.new, tagMessage)) {
        shouldPush = true;
    } else {
        context.logger.warn("Git tag already exists");
    }

    if (!shouldPush || !(await utils.gitPush(context, context.branch.name, true))) {
        context.logger.warn("Nothing to push");
    }
}
