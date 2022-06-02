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
        const globber = await glob.create(context.workspaces.join("\n"), { implicitDescendants: false });
        let releaseNotes = "";

        for (const packageDir of await globber.glob()) {
            const changelogPath = path.join(path.relative(process.cwd(), packageDir), changelogFile);
            const packageReleaseNotes = getPackageChangelog(context, changelogPath, headerLine);
            if (packageReleaseNotes != null) {
                releaseNotes += `**${path.basename(packageDir)}**\n${packageReleaseNotes}\n\n`;
            }
            if (updatePackageChangelog(context, changelogPath, headerLine)) {
                context.changedFiles.push(changelogPath);
            }
        }

        context.releaseNotes = releaseNotes || undefined;
    } else {
        context.releaseNotes = getPackageChangelog(context, changelogFile, headerLine);

        if (updatePackageChangelog(context, changelogFile, headerLine)) {
            context.changedFiles.push(changelogFile);
        }
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

function updatePackageChangelog(context: IContext, changelogFile: string, headerLine: string): boolean {
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
