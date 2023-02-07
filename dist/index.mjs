#!/usr/bin/env node
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
import {
  require_dist,
  require_env_ci,
  require_micromatch,
  require_semver
} from "./chunk-QAZ5FMEW.mjs";
import {
  require_core
} from "./chunk-S4LJCPE2.mjs";
import {
  require_exec
} from "./chunk-X2EBWIRY.mjs";
import {
  __async,
  __require,
  __spreadProps,
  __spreadValues,
  __toESM
} from "./chunk-R3TGK222.mjs";

// packages/core/src/main.ts
var core4 = __toESM(require_core());
import * as path4 from "path";

// packages/core/src/inputs.ts
var core = __toESM(require_core());
import * as path from "path";
var Inputs = class {
  /**
   * Specify whether to detect [ci skip] in last commit message
   */
  static get ciSkip() {
    try {
      return core.getBooleanInput("ci-skip");
    } catch (error3) {
      if (error3 instanceof TypeError) {
        return true;
      }
      throw error3;
    }
  }
  /**
   * Custom directory to search for release configuration.
   */
  static get configDir() {
    const input = core.getInput("config-dir");
    return input ? path.resolve(this.rootDir, input) : void 0;
  }
  /**
   * Don't make any changes but report what would have been done.
   */
  static get dryRun() {
    try {
      return core.getBooleanInput("dry-run");
    } catch (error3) {
      if (error3 instanceof TypeError) {
        return false;
      }
      throw error3;
    }
  }
  /**
   * New version number that should be released.
   */
  static get newVersion() {
    return core.getInput("new-version") || void 0;
  }
  /**
   * Comma-separated list of stages that should be skipped.
   */
  static get skipStages() {
    const input = core.getInput("skip-stages");
    return input ? input.split(",").map((s) => s.trim()) : [];
  }
  /**
   * Custom working directory to use instead of the project root.
   */
  static get workingDir() {
    return core.getInput("working-dir") || void 0;
  }
};
Inputs.rootDir = process.cwd();

// packages/core/src/stages.ts
var core2 = __toESM(require_core());
import * as path2 from "path";
function fail(context, pluginsLoaded) {
  return __async(this, null, function* () {
    yield runStage(context, pluginsLoaded, { name: "fail" });
  });
}
function init(context, pluginsLoaded) {
  return __async(this, null, function* () {
    yield runStage(context, pluginsLoaded, { name: "init", canSkip: false });
  });
}
function publish(context, pluginsLoaded) {
  return __async(this, null, function* () {
    yield runStage(context, pluginsLoaded, { name: "publish" });
  });
}
function success(context, pluginsLoaded) {
  return __async(this, null, function* () {
    yield runStage(context, pluginsLoaded, { name: "success" });
  });
}
function version(context, pluginsLoaded) {
  return __async(this, null, function* () {
    yield runStage(context, pluginsLoaded, { name: "version" });
  });
}
function runStage(context, pluginsLoaded, stage) {
  return __async(this, null, function* () {
    if (shouldSkipStage(stage)) {
      return;
    }
    for (const [pluginName, pluginModule] of Object.entries(pluginsLoaded)) {
      if (pluginModule[stage.name] == null) {
        continue;
      }
      for (const pluginConfig of context.plugins[pluginName] || []) {
        context.logger.info(`Running "${stage.name}" stage for plugin ${pluginName}`);
        const oldEnv = loadEnv({ cwd: pluginConfig.$cwd, env: pluginConfig.$env });
        context.logger.pluginName = pluginName;
        try {
          yield pluginModule[stage.name](context, pluginConfig);
        } finally {
          context.logger.pluginName = void 0;
          unloadEnv(oldEnv);
        }
      }
    }
  });
}
function shouldSkipStage(stage) {
  if (stage.canSkip !== false && Inputs.skipStages.includes(stage.name)) {
    core2.info(`Skipping "${stage.name}" stage`);
    return true;
  }
  return false;
}
function loadEnv(newEnv) {
  const oldEnv = {};
  if (newEnv.cwd != null) {
    oldEnv.cwd = process.cwd();
    process.chdir(path2.resolve(newEnv.cwd));
  }
  oldEnv.env = {};
  for (const [k, v] of Object.entries(newEnv.env || {})) {
    oldEnv.env[k] = process.env[k];
    process.env[k] = v.toString();
  }
  return oldEnv;
}
function unloadEnv(oldEnv) {
  if (oldEnv.cwd != null) {
    process.chdir(oldEnv.cwd);
  }
  for (const [k, v] of Object.entries(oldEnv.env || {})) {
    if (v != null) {
      process.env[k] = v.toString();
    } else {
      delete process.env[k];
    }
  }
}

// packages/core/src/utils.ts
var exec = __toESM(require_exec());
var import_cosmiconfig = __toESM(require_dist());
import * as fs from "fs";
import * as path3 from "path";

// packages/core/src/logger.ts
var core3 = __toESM(require_core());
var Logger = class {
  constructor(pluginName) {
    this.pluginName = pluginName;
  }
  /**
   * Output debug level message with plugin name prepended.
   * @param message Text to output
   */
  debug(message) {
    core3.debug(this.prependPluginName(message));
  }
  /**
   * Output error level message with plugin name prepended.
   * @param message Text to output
   */
  error(message) {
    core3.error(this.prependPluginName(message));
  }
  /**
   * Output info level message with plugin name prepended.
   * @param message Text to output
   */
  info(message) {
    core3.info(this.prependPluginName(message));
  }
  /**
   * Output warning level message with plugin name prepended.
   * @param message Text to output
   */
  warn(message) {
    core3.warning(this.prependPluginName(message));
  }
  /**
   * If plugin name is defined for this logger, prepend it to message.
   * @param message Text to output
   * @returns Text with plugin name prepended
   */
  prependPluginName(message) {
    return this.pluginName ? `[${this.pluginName}] ${message}` : message;
  }
};

// packages/core/src/utils.ts
function buildContext(opts) {
  return __async(this, null, function* () {
    var _a;
    const envCi = yield loadCiEnv();
    const config = yield (0, import_cosmiconfig.cosmiconfig)("release").search(Inputs.configDir);
    if (config == null || config.isEmpty) {
      throw new Error("Failed to load config because file does not exist or is empty");
    }
    const micromatch = require_micromatch();
    const branches = config.config.branches.map((branch) => typeof branch === "string" ? { name: branch } : branch);
    const branchIndex = branches.findIndex((branch) => micromatch.isMatch((opts == null ? void 0 : opts.branch) || envCi.branch, branch.name));
    if (branchIndex == -1 && !(opts == null ? void 0 : opts.force)) {
      return;
    }
    const branchInfo = (_a = branches[branchIndex]) != null ? _a : {};
    branchInfo.name = (opts == null ? void 0 : opts.branch) || envCi.branch;
    if (branchIndex > 0 && branchInfo.channel == null) {
      branchInfo.channel = branchInfo.name;
    }
    const pluginConfig = {};
    for (const pc of config.config.plugins || []) {
      if (typeof pc === "string") {
        pluginConfig[pc] = [{}];
      } else {
        pluginConfig[pc[0]] = pc.slice(1);
      }
    }
    const tagPrefix = config.config.tagPrefix || "v";
    const versionInfo = yield buildVersionInfo(branchInfo, tagPrefix);
    return {
      branch: branchInfo,
      changedFiles: [],
      ci: envCi,
      dryRun: Inputs.dryRun,
      env: process.env,
      logger: new Logger(),
      plugins: pluginConfig,
      releasedPackages: {},
      rootDir: process.cwd(),
      tagPrefix,
      version: versionInfo
    };
  });
}
function loadPlugins(context) {
  return __async(this, null, function* () {
    const pluginsLoaded = {};
    for (const pluginName in context.plugins) {
      let pluginPath = pluginName;
      if (!pluginName.startsWith("./")) {
        pluginPath = `./node_modules/${pluginName}`;
      }
      if (pluginName.startsWith("@octorelease/") && !fs.existsSync(pluginPath)) {
        pluginPath = pluginName.replace("@octorelease", __dirname);
      }
      pluginPath = path3.resolve(pluginPath);
      if (pluginPath.endsWith(".mjs")) {
        pluginsLoaded[pluginName] = yield import(path3.resolve(pluginPath));
      } else {
        pluginsLoaded[pluginName] = __require(path3.resolve(pluginPath));
      }
    }
    return pluginsLoaded;
  });
}
function verifyConditions(context) {
  return __async(this, null, function* () {
    context.version.new = Inputs.newVersion || context.version.new;
    if (context.version.prerelease != null) {
      context.version.new = `${context.version.new.split("-")[0]}-${context.version.prerelease}`;
    }
    const semverDiff = require_semver().diff(context.version.old.split("-")[0], context.version.new.split("-")[0]);
    if (semverDiff === "major" && (context.branch.level === "minor" || context.branch.level === "patch") || semverDiff === "minor" && context.branch.level === "patch") {
      throw new Error(`Protected branch ${context.branch.name} does not allow ${semverDiff} version changes`);
    }
  });
}
function buildVersionInfo(branch, tagPrefix) {
  return __async(this, null, function* () {
    const cmdOutput = yield exec.getExecOutput(
      "git",
      ["describe", "--abbrev=0", `--match=${tagPrefix}*`],
      { ignoreReturnCode: true }
    );
    const oldVersion = cmdOutput.exitCode === 0 && cmdOutput.stdout.trim().slice(tagPrefix.length) || "0.0.0";
    let prerelease = void 0;
    if (branch.prerelease) {
      const prereleaseName = typeof branch.prerelease === "string" ? branch.prerelease : branch.name;
      const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/\D/g, "").slice(0, 12);
      prerelease = `${prereleaseName}.${timestamp}`;
    }
    return { old: oldVersion, new: oldVersion, prerelease };
  });
}
function getLastCommitMessage(context) {
  return __async(this, null, function* () {
    const cmdOutput = yield exec.getExecOutput(
      "git",
      ["log", "-1", "--pretty=format:%s", context.ci.commit],
      { ignoreReturnCode: true }
    );
    return cmdOutput.exitCode === 0 && cmdOutput.stdout.trim() || void 0;
  });
}
function loadCiEnv() {
  return __async(this, null, function* () {
    const envCi = require_env_ci()();
    if (envCi.service == null) {
      throw new Error(`Unsupported CI service detected: ${envCi.service}`);
    }
    if (envCi.branch == null) {
      const cmdOutput = yield exec.getExecOutput("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
      envCi.branch = cmdOutput.stdout.trim();
    }
    if (envCi.commit == null) {
      const cmdOutput = yield exec.getExecOutput("git", ["rev-parse", "HEAD"]);
      envCi.commit = cmdOutput.stdout.trim();
    }
    if (envCi.slug == null) {
      const cmdOutput = yield exec.getExecOutput("git", ["config", "--get", "remote.origin.url"]);
      envCi.slug = cmdOutput.stdout.trim().replace(/\.git$/, "").split("/").slice(-2).join("/");
    }
    const [owner, repo] = envCi.slug.split("/");
    return __spreadProps(__spreadValues({}, envCi), { repo: { owner, repo } });
  });
}

// packages/core/src/main.ts
function run() {
  return __async(this, null, function* () {
    var _a;
    try {
      if (Inputs.workingDir != null) {
        process.chdir(path4.resolve(Inputs.workingDir));
      }
      const context = yield buildContext();
      if (context == null) {
        core4.info("Current branch is not a release branch, exiting now");
        process.exit();
      } else if (Inputs.ciSkip && ((_a = yield getLastCommitMessage(context)) == null ? void 0 : _a.includes("[ci skip]"))) {
        core4.info("Commit message contains CI skip phrase, exiting now");
        process.exit();
      }
      const pluginsLoaded = yield loadPlugins(context);
      try {
        yield init(context, pluginsLoaded);
        yield verifyConditions(context);
        yield version(context, pluginsLoaded);
        yield publish(context, pluginsLoaded);
        yield success(context, pluginsLoaded);
      } catch (error3) {
        if (error3 instanceof Error) {
          context.failError = error3;
          yield fail(context, pluginsLoaded);
        }
        throw error3;
      }
    } catch (error3) {
      if (error3 instanceof Error) {
        core4.error(error3.stack || error3.message);
      }
      core4.setFailed(error3);
    }
  });
}
run();
