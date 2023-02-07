import { createRequire } from 'module'; const require = createRequire(import.meta.url);
import {
  require_lib
} from "./chunk-JJLY7FXJ.mjs";
import "./chunk-QAZ5FMEW.mjs";
import "./chunk-S4LJCPE2.mjs";
import {
  require_exec
} from "./chunk-X2EBWIRY.mjs";
import {
  __async,
  __export,
  __toESM
} from "./chunk-R3TGK222.mjs";

// packages/vsce/src/init.ts
import * as fs2 from "fs";

// packages/vsce/src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  ovsxInfo: () => ovsxInfo,
  ovsxPublish: () => ovsxPublish,
  verifyToken: () => verifyToken,
  vsceInfo: () => vsceInfo,
  vscePackage: () => vscePackage,
  vscePublish: () => vscePublish
});
var exec = __toESM(require_exec());
var import_core = __toESM(require_lib());
import * as fs from "fs";
import * as path from "path";
function ovsxInfo(extensionName) {
  return __async(this, null, function* () {
    const cmdOutput = yield exec.getExecOutput("npx", ["ovsx", "get", extensionName, "--metadata"]);
    return JSON.parse(cmdOutput.stdout);
  });
}
function ovsxPublish(context, vsixPath) {
  return __async(this, null, function* () {
    const cmdArgs = ["ovsx", "publish"];
    if (vsixPath != null) {
      cmdArgs.push("--packagePath", vsixPath);
    } else if (fs.existsSync(path.join(context.rootDir, "yarn.lock"))) {
      cmdArgs.push("--yarn");
    }
    yield import_core.utils.dryRunTask(context, `npx ${cmdArgs.join(" ")}`, () => __async(this, null, function* () {
      yield exec.exec("npx", cmdArgs);
    }));
  });
}
function vsceInfo(extensionName) {
  return __async(this, null, function* () {
    const cmdOutput = yield exec.getExecOutput("npx", ["vsce", "show", extensionName, "--json"]);
    return JSON.parse(cmdOutput.stdout);
  });
}
function vscePackage(context) {
  return __async(this, null, function* () {
    var _a;
    const cmdArgs = ["vsce", "package"];
    if (fs.existsSync(path.join((context == null ? void 0 : context.rootDir) || "", "yarn.lock"))) {
      cmdArgs.push("--yarn");
    }
    const cmdOutput = yield exec.getExecOutput("npx", cmdArgs);
    return (_a = cmdOutput.stdout.trim().match(/Packaged: (.*\.vsix)/)) == null ? void 0 : _a[1];
  });
}
function vscePublish(context, vsixPath) {
  return __async(this, null, function* () {
    const cmdArgs = ["vsce", "publish"];
    if (vsixPath != null) {
      cmdArgs.push("--packagePath", vsixPath);
    } else if (fs.existsSync(path.join(context.rootDir, "yarn.lock"))) {
      cmdArgs.push("--yarn");
    }
    yield import_core.utils.dryRunTask(context, `npx ${cmdArgs.join(" ")}`, () => __async(this, null, function* () {
      yield exec.exec("npx", cmdArgs);
    }));
  });
}
function verifyToken(tool, publisher) {
  return __async(this, null, function* () {
    yield exec.exec("npx", [tool, "verify-pat", publisher]);
  });
}

// packages/vsce/src/init.ts
function init_default(context, config) {
  return __async(this, null, function* () {
    let packageJson;
    try {
      packageJson = JSON.parse(fs2.readFileSync("package.json", "utf-8"));
      context.logger.info(`VS Code extension: ${packageJson.publisher}.${packageJson.name}`);
    } catch (e) {
      throw new Error(`Missing or invalid package.json in branch ${context.branch.name}`);
    }
    if (config.vscePublish !== false && context.env.VSCE_PAT == null) {
      throw new Error("Required environment variable VSCE_PAT is undefined");
    }
    if (config.ovsxPublish && context.env.OVSX_PAT == null) {
      throw new Error("Required environment variable OVSX_PAT is undefined");
    }
    if (config.vscePublish !== false) {
      yield verifyToken("vsce", packageJson.publisher);
    }
    if (config.ovsxPublish) {
      yield verifyToken("ovsx", packageJson.publisher);
    }
  });
}

// packages/vsce/src/publish.ts
import * as fs3 from "fs";
import * as path2 from "path";
function publish_default(context, config) {
  return __async(this, null, function* () {
    const packageJson = JSON.parse(fs3.readFileSync("package.json", "utf-8"));
    const extensionName = `${packageJson.publisher}.${packageJson.name}`;
    let vsixPath;
    if (config.vsixDir != null) {
      const tempVsixPath = yield vscePackage(context);
      vsixPath = path2.resolve(context.rootDir, config.vsixDir, path2.basename(tempVsixPath));
      fs3.mkdirSync(config.vsixDir, { recursive: true });
      fs3.renameSync(tempVsixPath, vsixPath);
    }
    if (packageJson.private) {
      context.logger.info(`Skipping publish of private package ${packageJson.name}`);
      return;
    }
    if (config.vscePublish !== false) {
      const vsceMetadata = yield vsceInfo(extensionName);
      if (!vsceMetadata.versions.find((obj) => obj.version === packageJson.version)) {
        yield vscePublish(context, vsixPath);
        context.releasedPackages.vsce = [
          ...context.releasedPackages.vsce || [],
          {
            name: `${extensionName}@${packageJson.version}`,
            url: `https://marketplace.visualstudio.com/items?itemName=${extensionName}`
          }
        ];
      } else {
        context.logger.error(`Version ${packageJson.version} has already been published to VS Code Marketplace`);
      }
    }
    if (config.ovsxPublish) {
      const ovsxMetadata = yield ovsxInfo(extensionName);
      if (!Object.keys(ovsxMetadata.allVersions).includes(packageJson.version)) {
        yield ovsxPublish(context, vsixPath);
        context.releasedPackages.vsce = [
          ...context.releasedPackages.vsce || [],
          {
            name: `${extensionName}@${packageJson.version} (OVSX)`,
            url: `https://open-vsx.org/extension/${extensionName.replace(".", "/")}`
          }
        ];
      } else {
        context.logger.error(`Version ${packageJson.version} has already been published to Open VSX Registry`);
      }
    }
  });
}
export {
  init_default as init,
  publish_default as publish,
  utils_exports as utils
};
