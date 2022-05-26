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
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";

export default function (context: IContext, config: IPluginConfig): void {
    const changelogFile = config.changelogFile || "CHANGELOG.md";
    const headerLine = config.headerLine || "## Recent Changes";
    context.releaseNotes = getReleaseNotes(context, changelogFile, headerLine);
}

function getReleaseNotes(context: IContext, changelogFile: string, headerLine: string): string | undefined {
    if (context.workspaces != null) {
        let releaseNotes = "";
        for (const w of context.workspaces) {
            const packageReleaseNotes = getPackageChangelog(context, path.join(w.path, changelogFile), headerLine);
            if (packageReleaseNotes != null) {
                releaseNotes += `**${w.name ?? path.basename(w.path)}**\n${packageReleaseNotes}\n\n`;
            }
        }
        return releaseNotes || undefined;
    } else {
        return getPackageChangelog(context, changelogFile, headerLine);
    }
}

function getPackageChangelog(context: IContext, changelogFile: string, headerLine: string): string | undefined {
    let releaseNotes = "";

    if (fs.existsSync(changelogFile)) {
        const changelogLines: string[] = fs.readFileSync(changelogFile, "utf-8").split(/\r?\n/);
        let lineNum = changelogLines.findIndex(line => line.startsWith(headerLine));

        if (lineNum !== -1) {
            while (changelogLines[lineNum + 1] != null && !changelogLines[lineNum + 1].startsWith("## ")) {
                lineNum++;
                releaseNotes += changelogLines[lineNum] + "\n";
            }
            context.logger.info(`Found changelog header in ${changelogFile}`);
        } else {
            context.logger.warn(`Missing changelog header in ${changelogFile}`);
        }
    } else {
        context.logger.warn(`Missing changelog file ${changelogFile}`);
    }

    return releaseNotes.trim() || undefined;
}
