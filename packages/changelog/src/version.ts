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
