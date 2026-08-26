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

import * as fs from "fs";
import { IContext } from "@octorelease/core";
import * as semver from "semver";
import { IPluginApi } from "../plugins";

export default async function (context: IContext, api: IPluginApi): Promise<void> {
    context.version.new = context.version.old.split("-")[0];
    if (!context.branch.prerelease && context.branch.level !== "none") {
        context.version.new = semver.inc(context.version.new, context.branch.level as semver.ReleaseType)!;
    }
    context.version.new = (context.env.VERSION_STRING || "%s").replace("%s", context.version.new);

    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
    if (packageJson.workspaces != null) {
        await api.lerna.version(context, {});
    } else {
        await api.npm.version(context, {});
    }

    await api.git.utils.gitAdd(...context.changedFiles);
    await api.git.utils.gitCommit(`Bump version to ${context.version.new}`);
    await api.git.utils.gitPush(context, context.branch.name);
}
