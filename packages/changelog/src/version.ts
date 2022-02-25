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
import * as path from "path";
import * as glob from "@actions/glob";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    const changelogFile = config.changelogFile || "CHANGELOG.md";
    const headerLine = config.headerLine || "## Recent Changes";
    if (context.workspaces != null) {
        const globber = await glob.create(context.workspaces.join("\n"));
        for (const packageDir of await globber.glob()) {
            const changelogPath = path.join(packageDir, changelogFile);
            if (updateChangelog(context, changelogPath, headerLine)) {
                context.changedFiles.push(changelogPath);
            }
        }
    } else if (updateChangelog(context, changelogFile, headerLine)) {
        context.changedFiles.push(changelogFile);
    }
}

function updateChangelog(context: IContext, changelogFile: string, headerLine: string): boolean {
    if (fs.existsSync(changelogFile)) {
        const oldContents = fs.readFileSync(changelogFile, "utf-8");
        const newContents = oldContents.replace(headerLine, `## \`${context.version.new}\``);

        if (newContents !== oldContents) {
            fs.writeFileSync(changelogFile, newContents);
            context.logger.info(`Updated version header in ${changelogFile}`)
            return true;
        }
    }

    return false;
}
