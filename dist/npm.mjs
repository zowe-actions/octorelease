import { createRequire } from 'module'; const require = createRequire(import.meta.url);
import {
  require_find_up
} from "./chunk-2CUC3JOI.mjs";
import {
  require_delay
} from "./chunk-AXJXD5ZX.mjs";
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

// packages/npm/src/init.ts
import * as fs2 from "fs";

// packages/npm/src/config.ts
var DEFAULT_NPM_REGISTRY = "https://registry.npmjs.org/";

// packages/npm/src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  npmAddTag: () => npmAddTag,
  npmConfig: () => npmConfig,
  npmInstall: () => npmInstall,
  npmPack: () => npmPack,
  npmPublish: () => npmPublish,
  npmVersion: () => npmVersion,
  npmView: () => npmView,
  verifyConditions: () => verifyConditions
});
var exec = __toESM(require_exec());
var import_core = __toESM(require_lib());
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
function npmAddTag(context, pkgSpec, tag, registry, inDir) {
  return __async(this, null, function* () {
    const cmdArgs = ["dist-tag", "add", pkgSpec, tag, "--registry", registry];
    yield import_core.utils.dryRunTask(context, `npm ${cmdArgs.join(" ")}`, () => __async(this, null, function* () {
      yield exec.exec("npm", cmdArgs, { cwd: inDir });
    }));
  });
}
function npmConfig(context, registry, useTokenAuth = true) {
  return __async(this, null, function* () {
    const npmrcLines = [];
    const registrySpec = (registry.endsWith("/") ? registry : registry + "/").replace(/^\w+:/, "");
    if (useTokenAuth) {
      npmrcLines.push(`${registrySpec}:_authToken=${context.env.NPM_TOKEN}`);
    } else {
      const b64Auth = Buffer.from(`${context.env.NPM_USERNAME}:${context.env.NPM_PASSWORD}`).toString("base64");
      npmrcLines.push(`${registrySpec}:_auth=${b64Auth}`);
      npmrcLines.push(`${registrySpec}:email=${context.env.NPM_EMAIL}`);
    }
    fs.appendFileSync(path.join(os.homedir(), ".npmrc"), npmrcLines.join("\n"));
    yield exec.exec("npm", ["whoami", "--registry", registry]);
  });
}
function npmInstall(pkgSpec, registry, inDir) {
  return __async(this, null, function* () {
    const registryPrefix = pkgSpec.startsWith("@") ? `${pkgSpec.split("/")[0]}:` : "";
    yield exec.exec("npm", ["install", pkgSpec, `--${registryPrefix}registry=${registry}`], { cwd: inDir });
  });
}
function npmPack(inDir) {
  return __async(this, null, function* () {
    const cmdOutput = yield exec.getExecOutput("npm", ["pack"], { cwd: inDir });
    return cmdOutput.stdout.trim().split(/\s+/).pop();
  });
}
function npmPublish(context, tag, registry, inDir) {
  return __async(this, null, function* () {
    const cmdArgs = ["publish", "--tag", tag, "--registry", registry];
    if (context.dryRun) {
      cmdArgs.push("--dry-run");
    }
    yield exec.exec("npm", cmdArgs, { cwd: inDir });
  });
}
function npmVersion(newVersion) {
  return __async(this, null, function* () {
    yield exec.exec("npm", ["version", newVersion, "--allow-same-version", "--no-git-tag-version"]);
  });
}
function npmView(pkgSpec, registry, property) {
  return __async(this, null, function* () {
    const registryPrefix = pkgSpec.startsWith("@") ? `${pkgSpec.split("/")[0]}:` : "";
    const cmdArgs = ["view", `${pkgSpec}`, "--json", `--${registryPrefix}registry=${registry}`];
    if (property != null) {
      cmdArgs.push(property);
    }
    try {
      const cmdOutput = yield exec.getExecOutput("npm", cmdArgs);
      return JSON.parse(cmdOutput.stdout.trim());
    } catch (e) {
    }
  });
}
function verifyConditions(context) {
  const useTokenAuth = context.env.NPM_USERNAME == null && context.env.NPM_PASSWORD == null && context.env.NPM_EMAIL == null;
  if (useTokenAuth && context.env.NPM_TOKEN == null) {
    throw new Error("Required environment variable NPM_TOKEN is undefined");
  } else if (!useTokenAuth) {
    const missingEnvVars = ["NPM_USERNAME", "NPM_PASSWORD", "NPM_EMAIL"].filter((name) => context.env[name] == null);
    if (missingEnvVars.length == 1) {
      throw new Error(`Required environment variable ${missingEnvVars[0]} is undefined`);
    } else if (missingEnvVars.length > 1) {
      throw new Error(`Required environment variables ${missingEnvVars.join(", ")} are undefined`);
    }
  }
  return useTokenAuth;
}

// packages/npm/src/init.ts
function init_default(context, config) {
  return __async(this, null, function* () {
    let publishConfig;
    try {
      const packageJson = JSON.parse(fs2.readFileSync("package.json", "utf-8"));
      context.version.new = packageJson.version;
      publishConfig = packageJson.publishConfig;
    } catch (e) {
      throw new Error(`Missing or invalid package.json in branch ${context.branch.name}`);
    }
    if (config.pruneShrinkwrap && !fs2.existsSync("npm-shrinkwrap.json")) {
      throw new Error("Could not find npm-shrinkwrap.json but the pruneShrinkwrap option was specified");
    }
    context.branch.channel = context.branch.channel || "latest";
    if (config.npmPublish === false) {
      return;
    }
    const useTokenAuth = verifyConditions(context);
    yield npmConfig(context, (publishConfig == null ? void 0 : publishConfig.registry) || DEFAULT_NPM_REGISTRY, useTokenAuth);
  });
}

// packages/npm/src/publish.ts
var exec3 = __toESM(require_exec());
import * as fs3 from "fs";
import * as path2 from "path";
function publish_default(context, config, inDir) {
  return __async(this, null, function* () {
    var _a, _b;
    const cwd = inDir || process.cwd();
    const packageJson = JSON.parse(fs3.readFileSync(path2.join(cwd, "package.json"), "utf-8"));
    if (config.pruneShrinkwrap) {
      if (packageJson.scripts.preshrinkwrap != null) {
        yield exec3.exec("npm", ["run", "preshrinkwrap"], { cwd });
      }
      pruneShrinkwrap(inDir);
    }
    if (config.tarballDir != null) {
      const tgzFile = yield npmPack(inDir);
      fs3.mkdirSync(config.tarballDir, { recursive: true });
      fs3.renameSync(path2.join(cwd, tgzFile), path2.resolve(context.rootDir, config.tarballDir, tgzFile));
    }
    if (config.npmPublish === false) {
      return;
    } else if (fs3.existsSync(".npmrc")) {
      fs3.renameSync(".npmrc", ".npmrc.bak");
    }
    if (packageJson.private) {
      context.logger.info(`Skipping publish of private package ${packageJson.name}`);
      return;
    }
    try {
      const npmRegistry = ((_a = packageJson.publishConfig) == null ? void 0 : _a.registry) || DEFAULT_NPM_REGISTRY;
      const packageTag = context.branch.channel;
      const publishedVersions = yield npmView(packageJson.name, npmRegistry, "versions");
      if (!(publishedVersions == null ? void 0 : publishedVersions.includes(packageJson.version))) {
        yield npmPublish(context, packageTag, npmRegistry, inDir);
        context.releasedPackages.npm = [
          ...context.releasedPackages.npm || [],
          {
            name: `${packageJson.name}@${packageJson.version}`,
            url: npmRegistry === DEFAULT_NPM_REGISTRY ? `https://www.npmjs.com/package/${packageJson.name}/v/${packageJson.version}` : void 0,
            registry: npmRegistry
          }
        ];
      } else {
        context.logger.error(`Version ${packageJson.version} has already been published to NPM`);
      }
      const aliasTags = [];
      if (((_b = config.aliasTags) == null ? void 0 : _b[packageTag]) != null) {
        const aliasTagOrTags = config.aliasTags[packageTag];
        aliasTags.push(...typeof aliasTagOrTags === "string" ? [aliasTagOrTags] : aliasTagOrTags);
      }
      for (const tag of [packageTag, ...aliasTags]) {
        yield npmAddTag(context, `${packageJson.name}@${packageJson.version}`, tag, npmRegistry, inDir);
      }
    } finally {
      if (fs3.existsSync(".npmrc.bak")) {
        fs3.renameSync(".npmrc.bak", ".npmrc");
      }
    }
  });
}
function pruneShrinkwrap(inDir) {
  const shrinkwrapPath = inDir != null ? path2.join(inDir, "npm-shrinkwrap.json") : "npm-shrinkwrap.json";
  const lockfile = JSON.parse(fs3.readFileSync(shrinkwrapPath, "utf-8"));
  const filterPkgs = (obj, key) => {
    for (const [pkgName, pkgData] of Object.entries(obj[key])) {
      if (["dev", "extraneous"].some((prop) => pkgData[prop])) {
        delete obj[key][pkgName];
      }
    }
  };
  filterPkgs(lockfile, "packages");
  filterPkgs(lockfile, "dependencies");
  fs3.writeFileSync(shrinkwrapPath, JSON.stringify(lockfile, null, 2) + "\n");
}

// packages/npm/src/success.ts
var import_core2 = __toESM(require_lib());
var import_delay = __toESM(require_delay());
import * as fs4 from "fs";
import * as os2 from "os";
import * as path3 from "path";
function success_default(context, config) {
  return __async(this, null, function* () {
    if (config.smokeTest && context.releasedPackages.npm != null) {
      context.logger.info("Performing smoke test, installing released package(s)");
      for (const { name, registry } of context.releasedPackages.npm) {
        const tmpDir = path3.join(os2.tmpdir(), context.ci.build, name);
        fs4.mkdirSync(tmpDir, { recursive: true });
        let tries = 0;
        while ((yield npmView(name, registry)) == null && tries < 60) {
          yield (0, import_delay.default)(1e3);
          tries += 1;
        }
        yield import_core2.utils.dryRunTask(context, `install ${name} from ${registry}`, () => __async(this, null, function* () {
          yield npmInstall(name, registry, tmpDir);
        }));
        fs4.rmdirSync(tmpDir, { recursive: true });
      }
    }
  });
}

// packages/npm/src/version.ts
var import_find_up = __toESM(require_find_up());
import * as path4 from "path";
function version_default(context, _config) {
  return __async(this, null, function* () {
    if (context.workspaces != null) {
      context.logger.warn("Cannot run npm version in workspaces");
      return;
    }
    yield npmVersion(context.version.new);
    context.changedFiles.push("package.json");
    const lockfilePath = yield (0, import_find_up.default)(["npm-shrinkwrap.json", "package-lock.json"]);
    if (lockfilePath != null) {
      context.changedFiles.push(path4.relative(context.rootDir, lockfilePath));
    } else {
      context.logger.warn("Could not find lockfile to update version in");
    }
  });
}
export {
  DEFAULT_NPM_REGISTRY,
  init_default as init,
  publish_default as publish,
  success_default as success,
  utils_exports as utils,
  version_default as version
};
