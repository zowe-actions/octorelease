import { createRequire } from 'module'; const require = createRequire(import.meta.url);
import {
  require_glob
} from "./chunk-5X6J3WAO.mjs";
import "./chunk-S4LJCPE2.mjs";
import {
  __async,
  __toESM
} from "./chunk-R3TGK222.mjs";

// packages/changelog/src/version.ts
var glob = __toESM(require_glob());
import * as fs from "fs";
import * as path from "path";
function version_default(context, config) {
  return __async(this, null, function* () {
    const changelogFile = config.changelogFile || "CHANGELOG.md";
    const headerLine = config.headerLine || "## Recent Changes";
    if (context.workspaces != null) {
      const globber = yield glob.create(context.workspaces.join("\n"), { implicitDescendants: false });
      const releaseNotes = {};
      for (const packageDir of yield globber.glob()) {
        const changelogPath = path.join(path.relative(context.rootDir, packageDir), changelogFile);
        const packageReleaseNotes = getPackageChangelog(context, changelogPath, headerLine);
        if (packageReleaseNotes != null) {
          releaseNotes[path.basename(packageDir)] = packageReleaseNotes;
        }
        if (updatePackageChangelog(context, changelogPath, headerLine)) {
          context.changedFiles.push(changelogPath);
        }
      }
      if (Object.keys(releaseNotes).length === 0) {
        return;
      } else if (config.displayNames == null) {
        context.releaseNotes = Object.entries(releaseNotes).map(([k, v]) => `# ${k}
${v}
`).join("\n");
      } else {
        const orderedSections = [];
        for (const [k, v] of Object.entries(config.displayNames)) {
          if (k in releaseNotes) {
            orderedSections.push(`# ${v}
${releaseNotes[k]}
`);
          }
        }
        context.releaseNotes = orderedSections.join("\n");
      }
    } else {
      context.releaseNotes = getPackageChangelog(context, changelogFile, headerLine);
      if (updatePackageChangelog(context, changelogFile, headerLine)) {
        context.changedFiles.push(changelogFile);
      }
    }
  });
}
function getPackageChangelog(context, changelogFile, headerLine) {
  let releaseNotes = "";
  if (fs.existsSync(changelogFile)) {
    const changelogLines = fs.readFileSync(changelogFile, "utf-8").split(/\r?\n/);
    let lineNum = changelogLines.findIndex((line) => line.startsWith(headerLine) || line.startsWith(`## \`${context.version.new}\``));
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
  return releaseNotes.trim() || void 0;
}
function updatePackageChangelog(context, changelogFile, headerLine) {
  if (context.version.new !== context.version.old && fs.existsSync(changelogFile)) {
    const oldContents = fs.readFileSync(changelogFile, "utf-8");
    const newContents = oldContents.replace(headerLine, `## \`${context.version.new}\``);
    if (newContents !== oldContents) {
      fs.writeFileSync(changelogFile, newContents);
      context.logger.info(`Updated version header in ${changelogFile}`);
      return true;
    }
  }
  return false;
}
export {
  version_default as version
};
