import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import * as glob from "@actions/glob";
import { IContext } from "../../doc";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    const changelogFile = config.changelogFile || "CHANGELOG.md";
    const headerLine = config.headerLine || "## Recent Changes";
    if (context.version.new != null) {
        if (context.workspaces != null) {
            const globber = await glob.create(context.workspaces.join("\n"));
            for (const packageDir of await globber.glob()) {
                const changelogPath = path.join(packageDir, changelogFile);
                if (updateChangelog(changelogPath, headerLine, context.version.new)) {
                    context.changedFiles.push(changelogPath);
                }
            }
        } else if (updateChangelog(changelogFile, headerLine, context.version.new)) {
            context.changedFiles.push(changelogFile);
        }
    }
}

function updateChangelog(changelogFile: string, headerLine: string, newVersion: string): boolean {
    if (fs.existsSync(changelogFile)) {
        const oldContents = fs.readFileSync(changelogFile, "utf-8");
        const newContents = oldContents.replace(headerLine, `## \`${newVersion}\``);

        if (newContents !== oldContents) {
            fs.writeFileSync(changelogFile, newContents);
            core.info(`Updated version header in ${changelogFile}`)
            return true;
        }
    }

    return false;
}
