/**
 * Copyright 2020-2023 Zowe Actions Contributors
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
import { utils as gitUtils } from "@octorelease/git";
import { version as lernaVersion } from "@octorelease/lerna";
import { version as npmVersion } from "@octorelease/npm";

export default async function (context: IContext): Promise<void> {
    context.version.new = (context.env.VERSION_STRING || "%s").replace("%s",
        require("semver").inc(context.version.old, context.branch.level));

    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
    if (packageJson.workspaces != null) {
        await lernaVersion(context, {});
    } else {
        await npmVersion(context, {});
    }

    await gitUtils.gitAdd(...context.changedFiles);
    await gitUtils.gitCommit(`Bump version to ${context.version.new}`);
    await gitUtils.gitPush(context, context.branch.name);
}
