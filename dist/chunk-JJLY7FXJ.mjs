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
  __commonJS,
  __require
} from "./chunk-R3TGK222.mjs";

// packages/core/lib/doc/IConfig.js
var require_IConfig = __commonJS({
  "packages/core/lib/doc/IConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// packages/core/lib/doc/IContext.js
var require_IContext = __commonJS({
  "packages/core/lib/doc/IContext.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// packages/core/lib/doc/IPlugin.js
var require_IPlugin = __commonJS({
  "packages/core/lib/doc/IPlugin.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// packages/core/lib/doc/IPluginsLoaded.js
var require_IPluginsLoaded = __commonJS({
  "packages/core/lib/doc/IPluginsLoaded.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// packages/core/lib/doc/IProtectedBranch.js
var require_IProtectedBranch = __commonJS({
  "packages/core/lib/doc/IProtectedBranch.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// packages/core/lib/doc/IReleasedPackage.js
var require_IReleasedPackage = __commonJS({
  "packages/core/lib/doc/IReleasedPackage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// packages/core/lib/doc/IVersionInfo.js
var require_IVersionInfo = __commonJS({
  "packages/core/lib/doc/IVersionInfo.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// packages/core/lib/doc/index.js
var require_doc = __commonJS({
  "packages/core/lib/doc/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_IConfig(), exports);
    __exportStar(require_IContext(), exports);
    __exportStar(require_IPlugin(), exports);
    __exportStar(require_IPluginsLoaded(), exports);
    __exportStar(require_IProtectedBranch(), exports);
    __exportStar(require_IReleasedPackage(), exports);
    __exportStar(require_IVersionInfo(), exports);
  }
});

// packages/core/lib/inputs.js
var require_inputs = __commonJS({
  "packages/core/lib/inputs.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Inputs = void 0;
    var path = __importStar(__require("path"));
    var core = __importStar(require_core());
    var Inputs = class {
      /**
       * Specify whether to detect [ci skip] in last commit message
       */
      static get ciSkip() {
        try {
          return core.getBooleanInput("ci-skip");
        } catch (error) {
          if (error instanceof TypeError) {
            return true;
          }
          throw error;
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
        } catch (error) {
          if (error instanceof TypeError) {
            return false;
          }
          throw error;
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
    exports.Inputs = Inputs;
    Inputs.rootDir = process.cwd();
  }
});

// packages/core/lib/logger.js
var require_logger = __commonJS({
  "packages/core/lib/logger.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Logger = void 0;
    var core = __importStar(require_core());
    var Logger = class {
      constructor(pluginName) {
        this.pluginName = pluginName;
      }
      /**
       * Output debug level message with plugin name prepended.
       * @param message Text to output
       */
      debug(message) {
        core.debug(this.prependPluginName(message));
      }
      /**
       * Output error level message with plugin name prepended.
       * @param message Text to output
       */
      error(message) {
        core.error(this.prependPluginName(message));
      }
      /**
       * Output info level message with plugin name prepended.
       * @param message Text to output
       */
      info(message) {
        core.info(this.prependPluginName(message));
      }
      /**
       * Output warning level message with plugin name prepended.
       * @param message Text to output
       */
      warn(message) {
        core.warning(this.prependPluginName(message));
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
    exports.Logger = Logger;
  }
});

// packages/core/lib/stages.js
var require_stages = __commonJS({
  "packages/core/lib/stages.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = exports.success = exports.publish = exports.init = exports.fail = void 0;
    var path = __importStar(__require("path"));
    var core = __importStar(require_core());
    var inputs_1 = require_inputs();
    function fail(context, pluginsLoaded) {
      return __awaiter(this, void 0, void 0, function* () {
        yield runStage(context, pluginsLoaded, { name: "fail" });
      });
    }
    exports.fail = fail;
    function init(context, pluginsLoaded) {
      return __awaiter(this, void 0, void 0, function* () {
        yield runStage(context, pluginsLoaded, { name: "init", canSkip: false });
      });
    }
    exports.init = init;
    function publish(context, pluginsLoaded) {
      return __awaiter(this, void 0, void 0, function* () {
        yield runStage(context, pluginsLoaded, { name: "publish" });
      });
    }
    exports.publish = publish;
    function success(context, pluginsLoaded) {
      return __awaiter(this, void 0, void 0, function* () {
        yield runStage(context, pluginsLoaded, { name: "success" });
      });
    }
    exports.success = success;
    function version(context, pluginsLoaded) {
      return __awaiter(this, void 0, void 0, function* () {
        yield runStage(context, pluginsLoaded, { name: "version" });
      });
    }
    exports.version = version;
    function runStage(context, pluginsLoaded, stage) {
      return __awaiter(this, void 0, void 0, function* () {
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
      if (stage.canSkip !== false && inputs_1.Inputs.skipStages.includes(stage.name)) {
        core.info(`Skipping "${stage.name}" stage`);
        return true;
      }
      return false;
    }
    function loadEnv(newEnv) {
      const oldEnv = {};
      if (newEnv.cwd != null) {
        oldEnv.cwd = process.cwd();
        process.chdir(path.resolve(newEnv.cwd));
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
  }
});

// packages/core/lib/utils.js
var require_utils = __commonJS({
  "packages/core/lib/utils.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getLastCommitMessage = exports.verifyConditions = exports.loadPlugins = exports.dryRunTask = exports.buildContext = void 0;
    var fs = __importStar(__require("fs"));
    var path = __importStar(__require("path"));
    var exec = __importStar(require_exec());
    var cosmiconfig_1 = require_dist();
    var inputs_1 = require_inputs();
    var logger_1 = require_logger();
    function buildContext(opts) {
      var _a;
      return __awaiter(this, void 0, void 0, function* () {
        const envCi = yield loadCiEnv();
        const config = yield (0, cosmiconfig_1.cosmiconfig)("release").search(inputs_1.Inputs.configDir);
        if (config == null || config.isEmpty) {
          throw new Error("Failed to load config because file does not exist or is empty");
        }
        const micromatch = require_micromatch();
        const branches = config.config.branches.map((branch) => typeof branch === "string" ? { name: branch } : branch);
        const branchIndex = branches.findIndex((branch) => micromatch.isMatch((opts === null || opts === void 0 ? void 0 : opts.branch) || envCi.branch, branch.name));
        if (branchIndex == -1 && !(opts === null || opts === void 0 ? void 0 : opts.force)) {
          return;
        }
        const branchInfo = (_a = branches[branchIndex]) !== null && _a !== void 0 ? _a : {};
        branchInfo.name = (opts === null || opts === void 0 ? void 0 : opts.branch) || envCi.branch;
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
          dryRun: inputs_1.Inputs.dryRun,
          env: process.env,
          logger: new logger_1.Logger(),
          plugins: pluginConfig,
          releasedPackages: {},
          rootDir: process.cwd(),
          tagPrefix,
          version: versionInfo
        };
      });
    }
    exports.buildContext = buildContext;
    function dryRunTask(context, description, task) {
      return __awaiter(this, void 0, void 0, function* () {
        if (context.dryRun) {
          context.logger.info(`Skipping "${description}"`);
        } else {
          return task();
        }
      });
    }
    exports.dryRunTask = dryRunTask;
    function loadPlugins(context) {
      return __awaiter(this, void 0, void 0, function* () {
        const pluginsLoaded = {};
        for (const pluginName in context.plugins) {
          let pluginPath = pluginName;
          if (!pluginName.startsWith("./")) {
            pluginPath = `./node_modules/${pluginName}`;
          }
          if (pluginName.startsWith("@octorelease/") && !fs.existsSync(pluginPath)) {
            pluginPath = pluginName.replace("@octorelease", __dirname);
          }
          pluginsLoaded[pluginName] = __require(path.resolve(pluginPath));
        }
        return pluginsLoaded;
      });
    }
    exports.loadPlugins = loadPlugins;
    function verifyConditions(context) {
      return __awaiter(this, void 0, void 0, function* () {
        context.version.new = inputs_1.Inputs.newVersion || context.version.new;
        if (context.version.prerelease != null) {
          context.version.new = `${context.version.new.split("-")[0]}-${context.version.prerelease}`;
        }
        const semverDiff = require_semver().diff(context.version.old.split("-")[0], context.version.new.split("-")[0]);
        if (semverDiff === "major" && (context.branch.level === "minor" || context.branch.level === "patch") || semverDiff === "minor" && context.branch.level === "patch") {
          throw new Error(`Protected branch ${context.branch.name} does not allow ${semverDiff} version changes`);
        }
      });
    }
    exports.verifyConditions = verifyConditions;
    function buildVersionInfo(branch, tagPrefix) {
      return __awaiter(this, void 0, void 0, function* () {
        const cmdOutput = yield exec.getExecOutput("git", ["describe", "--abbrev=0", `--match=${tagPrefix}*`], { ignoreReturnCode: true });
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
      return __awaiter(this, void 0, void 0, function* () {
        const cmdOutput = yield exec.getExecOutput("git", ["log", "-1", "--pretty=format:%s", context.ci.commit], { ignoreReturnCode: true });
        return cmdOutput.exitCode === 0 && cmdOutput.stdout.trim() || void 0;
      });
    }
    exports.getLastCommitMessage = getLastCommitMessage;
    function loadCiEnv() {
      return __awaiter(this, void 0, void 0, function* () {
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
        return Object.assign(Object.assign({}, envCi), { repo: { owner, repo } });
      });
    }
  }
});

// packages/core/lib/index.js
var require_lib = __commonJS({
  "packages/core/lib/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.utils = exports.stages = void 0;
    __exportStar(require_doc(), exports);
    __exportStar(require_inputs(), exports);
    __exportStar(require_logger(), exports);
    exports.stages = __importStar(require_stages());
    exports.utils = __importStar(require_utils());
  }
});

export {
  require_lib
};
