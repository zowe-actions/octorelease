import { createRequire } from 'module'; const require = createRequire(import.meta.url);
import {
  require_lib
} from "./chunk-XOYOLRFM.mjs";
import {
  require_find_up
} from "./chunk-2CUC3JOI.mjs";
import "./chunk-AXJXD5ZX.mjs";
import "./chunk-JJLY7FXJ.mjs";
import "./chunk-QAZ5FMEW.mjs";
import "./chunk-S4LJCPE2.mjs";
import {
  require_exec
} from "./chunk-X2EBWIRY.mjs";
import {
  __async,
  __export,
  __spreadValues,
  __toESM
} from "./chunk-R3TGK222.mjs";

// packages/lerna/src/init.ts
var import_npm = __toESM(require_lib());
import * as fs from "fs";
function init_default(context, config) {
  return __async(this, null, function* () {
    var _a;
    let publishConfig;
    try {
      const lernaJson = JSON.parse(fs.readFileSync("lerna.json", "utf-8"));
      context.version.new = lernaJson.version;
      publishConfig = (_a = lernaJson.command) == null ? void 0 : _a.publish;
    } catch (e) {
      throw new Error(`Missing or invalid lerna.json in branch ${context.branch.name}`);
    }
    try {
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
      context.workspaces = packageJson.workspaces;
      if (publishConfig == null) {
        publishConfig = packageJson.publishConfig;
      }
    } catch (e) {
      throw new Error(`Missing or invalid package.json in branch ${context.branch.name}`);
    }
    context.branch.channel = context.branch.channel || "latest";
    if (config.npmPublish === false) {
      return;
    }
    const useTokenAuth = import_npm.utils.verifyConditions(context);
    yield import_npm.utils.npmConfig(context, (publishConfig == null ? void 0 : publishConfig.registry) || import_npm.DEFAULT_NPM_REGISTRY, useTokenAuth);
  });
}

// packages/lerna/src/publish.ts
var import_npm2 = __toESM(require_lib());

// packages/lerna/src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  lernaList: () => lernaList,
  lernaVersion: () => lernaVersion
});
var exec = __toESM(require_exec());
import * as fs2 from "fs";
function lernaList(onlyChanged) {
  return __async(this, null, function* () {
    let cmdOutput = yield exec.getExecOutput("npx", ["lerna", "list", "--json", "--toposort"]);
    const packageInfo = JSON.parse(cmdOutput.stdout);
    if (onlyChanged) {
      cmdOutput = yield exec.getExecOutput(
        "npx",
        ["lerna", "changed", "--include-merged-tags"],
        { ignoreReturnCode: true }
      );
      const changedPackages = cmdOutput.stdout.split(/\r?\n/);
      return packageInfo.filter((pkg) => changedPackages.includes(pkg.name));
    }
    return packageInfo;
  });
}
function lernaVersion(newVersion) {
  return __async(this, null, function* () {
    yield exec.exec("npx", [
      "lerna",
      "version",
      newVersion,
      "--exact",
      "--include-merged-tags",
      "--no-git-tag-version",
      "--yes"
    ]);
    if (!fs2.existsSync("yarn.lock")) {
      yield exec.exec("npm", ["install", "--package-lock-only", "--ignore-scripts", "--no-audit"]);
    }
  });
}

// packages/lerna/src/publish.ts
function publish_default(context, config) {
  return __async(this, null, function* () {
    for (const { name, location } of yield lernaList()) {
      const tempConfig = __spreadValues({}, config);
      if (Array.isArray(config.pruneShrinkwrap)) {
        tempConfig.pruneShrinkwrap = config.pruneShrinkwrap.includes(name);
      }
      yield (0, import_npm2.publish)(context, tempConfig, location);
    }
  });
}

// packages/lerna/src/success.ts
var import_npm3 = __toESM(require_lib());
function success_default(context, config) {
  return __async(this, null, function* () {
    yield (0, import_npm3.success)(context, config);
  });
}

// packages/lerna/src/version.ts
var import_find_up = __toESM(require_find_up());
import * as path from "path";
function version_default(context, _config) {
  return __async(this, null, function* () {
    const packageInfo = yield lernaList(true);
    yield lernaVersion(context.version.new);
    context.changedFiles.push("lerna.json", "package.json");
    const lockfilePath = yield (0, import_find_up.default)(["yarn.lock", "npm-shrinkwrap.json", "package-lock.json"]);
    if (lockfilePath != null) {
      context.changedFiles.push(path.relative(context.rootDir, lockfilePath));
    } else {
      context.logger.warn("Could not find lockfile to update version in");
    }
    for (const { location } of packageInfo) {
      const relLocation = path.relative(context.rootDir, location);
      context.changedFiles.push(path.join(relLocation, "package.json"));
    }
  });
}
export {
  init_default as init,
  publish_default as publish,
  success_default as success,
  utils_exports as utils,
  version_default as version
};
