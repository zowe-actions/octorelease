import * as fs from "fs";
import * as os from "os";
import * as core from "@actions/core";

export class Changelog {
    /**
     * Try to find release notes in changelog for the version being published.
     * @param changelogFile - Path to changelog file
     * @param pkgVer - Latest version of the package
     */
    public static getReleaseNotes(changelogFile: string, pkgVer: string): string | undefined {
        let releaseNotes = "";

        // Try to find release notes in changelog
        if (fs.existsSync(changelogFile)) {
            const changelogLines: string[] = fs.readFileSync(changelogFile, "utf-8").split(/\r?\n/);
            const pkgVerRegex = new RegExp(`## \\W*${pkgVer}\\W*`);

            let lineNum = changelogLines.findIndex((line) => line.match(pkgVerRegex));
            if (lineNum !== -1) {
                while ((changelogLines[lineNum + 1] != null) && !changelogLines[lineNum + 1].startsWith("## ")) {
                    lineNum++;
                    releaseNotes += changelogLines[lineNum] + os.EOL;
                }
            } else {
                core.warning(`Missing changelog header for version ${pkgVer}`);
            }
        } else {
            core.warning("Missing changelog file");
        }

        return releaseNotes.trim() || undefined;
    }

    /**
     * Update the changelog file, if one exists, to replace the header denoting
     * recent changes with a header for the new version.
     * @param changelogFile - Path to changelog file
     * @param pkgVer - New version of the package
     */
    public static updateLatestVersion(changelogFile: string, pkgVer: string): void {
        if (!fs.existsSync(changelogFile)) {
            core.warning("Missing changelog file, skipping changelog update");
            return;
        }

        const changelogHeader = core.getInput("changelog-header");
        if (!changelogHeader) {
            core.warning("Changelog header was not defined, skipping changelog update")
            return;
        }

        const changelogContents: string = fs.readFileSync(changelogFile, "utf-8");
        if (changelogContents.includes("## `" + pkgVer + "`")) {
            core.warning(`Changelog header already exists for version ${pkgVer}, skipping changelog update`);
            return;
        }

        if (!changelogContents.includes(changelogHeader)) {
            core.warning("Changelog header not found in changelog file, skipping changelog update");
            return;
        }

        fs.writeFileSync(changelogFile, changelogContents.replace(/## Recent Changes/, "## `" + pkgVer + "`"));
    }
}
