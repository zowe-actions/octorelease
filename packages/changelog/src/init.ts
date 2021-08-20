import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import * as glob from "@actions/glob";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    const changelogFile = config.changelogFile || "CHANGELOG.md";
    const headerLine = config.headerLine || "## Recent Changes";
    context.releaseNotes = await getReleaseNotes(context, changelogFile, headerLine);
}

async function getReleaseNotes(context: IContext, changelogFile: string, headerLine: string): Promise<string | undefined> {
    if (context.workspaces != null) {
        const globber = await glob.create(context.workspaces.join("\n"));
        let releaseNotes = "";

        for (const packageDir of await globber.glob()) {
            const packageReleaseNotes = getPackageChangelog(path.join(packageDir, changelogFile), headerLine);
            if (packageReleaseNotes != null) {
                // TODO Use package name as header instead of directory name
                releaseNotes += `**${path.basename(packageDir)}**\n${packageReleaseNotes}\n\n`;
            }
        }

        return releaseNotes || undefined;
    } else {
        return getPackageChangelog(changelogFile, headerLine);
    }
}

function getPackageChangelog(changelogFile: string, headerLine: string): string | undefined {
    let releaseNotes = "";

    if (fs.existsSync(changelogFile)) {
        const changelogLines: string[] = fs.readFileSync(changelogFile, "utf-8").split(/\r?\n/);
        let lineNum = changelogLines.findIndex(line => line.startsWith(headerLine));

        if (lineNum !== -1) {
            while (changelogLines[lineNum + 1] != null && !changelogLines[lineNum + 1].startsWith("## ")) {
                lineNum++;
                releaseNotes += changelogLines[lineNum] + "\n";
            }
            core.info(`Found changelog header in ${changelogFile}`);
        } else {
            core.warning(`Missing changelog header in ${changelogFile}`);
        }
    } else {
        core.warning(`Missing changelog file ${changelogFile}`);
    }

    return releaseNotes.trim() || undefined;
}
