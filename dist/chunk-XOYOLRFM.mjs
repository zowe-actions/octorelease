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
import {
  require_exec
} from "./chunk-X2EBWIRY.mjs";
import {
  __commonJS,
  __require
} from "./chunk-R3TGK222.mjs";

// packages/npm/lib/config.js
var require_config = __commonJS({
  "packages/npm/lib/config.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_NPM_REGISTRY = void 0;
    exports.DEFAULT_NPM_REGISTRY = "https://registry.npmjs.org/";
  }
});

// packages/npm/lib/utils.js
var require_utils = __commonJS({
  "packages/npm/lib/utils.js"(exports) {
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
    exports.verifyConditions = exports.npmView = exports.npmVersion = exports.npmPublish = exports.npmPack = exports.npmInstall = exports.npmConfig = exports.npmAddTag = void 0;
    var fs = __importStar(__require("fs"));
    var os = __importStar(__require("os"));
    var path = __importStar(__require("path"));
    var exec = __importStar(require_exec());
    var core_1 = require_lib();
    function npmAddTag(context, pkgSpec, tag, registry, inDir) {
      return __awaiter(this, void 0, void 0, function* () {
        const cmdArgs = ["dist-tag", "add", pkgSpec, tag, "--registry", registry];
        yield core_1.utils.dryRunTask(context, `npm ${cmdArgs.join(" ")}`, () => __awaiter(this, void 0, void 0, function* () {
          yield exec.exec("npm", cmdArgs, { cwd: inDir });
        }));
      });
    }
    exports.npmAddTag = npmAddTag;
    function npmConfig(context, registry, useTokenAuth = true) {
      return __awaiter(this, void 0, void 0, function* () {
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
    exports.npmConfig = npmConfig;
    function npmInstall(pkgSpec, registry, inDir) {
      return __awaiter(this, void 0, void 0, function* () {
        const registryPrefix = pkgSpec.startsWith("@") ? `${pkgSpec.split("/")[0]}:` : "";
        yield exec.exec("npm", ["install", pkgSpec, `--${registryPrefix}registry=${registry}`], { cwd: inDir });
      });
    }
    exports.npmInstall = npmInstall;
    function npmPack(inDir) {
      return __awaiter(this, void 0, void 0, function* () {
        const cmdOutput = yield exec.getExecOutput("npm", ["pack"], { cwd: inDir });
        return cmdOutput.stdout.trim().split(/\s+/).pop();
      });
    }
    exports.npmPack = npmPack;
    function npmPublish(context, tag, registry, inDir) {
      return __awaiter(this, void 0, void 0, function* () {
        const cmdArgs = ["publish", "--tag", tag, "--registry", registry];
        if (context.dryRun) {
          cmdArgs.push("--dry-run");
        }
        yield exec.exec("npm", cmdArgs, { cwd: inDir });
      });
    }
    exports.npmPublish = npmPublish;
    function npmVersion(newVersion) {
      return __awaiter(this, void 0, void 0, function* () {
        yield exec.exec("npm", ["version", newVersion, "--allow-same-version", "--no-git-tag-version"]);
      });
    }
    exports.npmVersion = npmVersion;
    function npmView(pkgSpec, registry, property) {
      return __awaiter(this, void 0, void 0, function* () {
        const registryPrefix = pkgSpec.startsWith("@") ? `${pkgSpec.split("/")[0]}:` : "";
        const cmdArgs = ["view", `${pkgSpec}`, "--json", `--${registryPrefix}registry=${registry}`];
        if (property != null) {
          cmdArgs.push(property);
        }
        try {
          const cmdOutput = yield exec.getExecOutput("npm", cmdArgs);
          return JSON.parse(cmdOutput.stdout.trim());
        } catch (_a) {
        }
      });
    }
    exports.npmView = npmView;
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
    exports.verifyConditions = verifyConditions;
  }
});

// packages/npm/lib/init.js
var require_init = __commonJS({
  "packages/npm/lib/init.js"(exports) {
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
    var fs = __importStar(__require("fs"));
    var config_1 = require_config();
    var utils = __importStar(require_utils());
    function default_1(context, config) {
      return __awaiter(this, void 0, void 0, function* () {
        let publishConfig;
        try {
          const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
          context.version.new = packageJson.version;
          publishConfig = packageJson.publishConfig;
        } catch (_a) {
          throw new Error(`Missing or invalid package.json in branch ${context.branch.name}`);
        }
        if (config.pruneShrinkwrap && !fs.existsSync("npm-shrinkwrap.json")) {
          throw new Error("Could not find npm-shrinkwrap.json but the pruneShrinkwrap option was specified");
        }
        context.branch.channel = context.branch.channel || "latest";
        if (config.npmPublish === false) {
          return;
        }
        const useTokenAuth = utils.verifyConditions(context);
        yield utils.npmConfig(context, (publishConfig === null || publishConfig === void 0 ? void 0 : publishConfig.registry) || config_1.DEFAULT_NPM_REGISTRY, useTokenAuth);
      });
    }
    exports.default = default_1;
  }
});

// packages/npm/lib/publish.js
var require_publish = __commonJS({
  "packages/npm/lib/publish.js"(exports) {
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
    var fs = __importStar(__require("fs"));
    var path = __importStar(__require("path"));
    var exec = __importStar(require_exec());
    var config_1 = require_config();
    var utils = __importStar(require_utils());
    function default_1(context, config, inDir) {
      var _a, _b;
      return __awaiter(this, void 0, void 0, function* () {
        const cwd = inDir || process.cwd();
        const packageJson = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf-8"));
        if (config.pruneShrinkwrap) {
          if (packageJson.scripts.preshrinkwrap != null) {
            yield exec.exec("npm", ["run", "preshrinkwrap"], { cwd });
          }
          pruneShrinkwrap(inDir);
        }
        if (config.tarballDir != null) {
          const tgzFile = yield utils.npmPack(inDir);
          fs.mkdirSync(config.tarballDir, { recursive: true });
          fs.renameSync(path.join(cwd, tgzFile), path.resolve(context.rootDir, config.tarballDir, tgzFile));
        }
        if (config.npmPublish === false) {
          return;
        } else if (fs.existsSync(".npmrc")) {
          fs.renameSync(".npmrc", ".npmrc.bak");
        }
        if (packageJson.private) {
          context.logger.info(`Skipping publish of private package ${packageJson.name}`);
          return;
        }
        try {
          const npmRegistry = ((_a = packageJson.publishConfig) === null || _a === void 0 ? void 0 : _a.registry) || config_1.DEFAULT_NPM_REGISTRY;
          const packageTag = context.branch.channel;
          const publishedVersions = yield utils.npmView(packageJson.name, npmRegistry, "versions");
          if (!(publishedVersions === null || publishedVersions === void 0 ? void 0 : publishedVersions.includes(packageJson.version))) {
            yield utils.npmPublish(context, packageTag, npmRegistry, inDir);
            context.releasedPackages.npm = [
              ...context.releasedPackages.npm || [],
              {
                name: `${packageJson.name}@${packageJson.version}`,
                url: npmRegistry === config_1.DEFAULT_NPM_REGISTRY ? `https://www.npmjs.com/package/${packageJson.name}/v/${packageJson.version}` : void 0,
                registry: npmRegistry
              }
            ];
          } else {
            context.logger.error(`Version ${packageJson.version} has already been published to NPM`);
          }
          const aliasTags = [];
          if (((_b = config.aliasTags) === null || _b === void 0 ? void 0 : _b[packageTag]) != null) {
            const aliasTagOrTags = config.aliasTags[packageTag];
            aliasTags.push(...typeof aliasTagOrTags === "string" ? [aliasTagOrTags] : aliasTagOrTags);
          }
          for (const tag of [packageTag, ...aliasTags]) {
            yield utils.npmAddTag(context, `${packageJson.name}@${packageJson.version}`, tag, npmRegistry, inDir);
          }
        } finally {
          if (fs.existsSync(".npmrc.bak")) {
            fs.renameSync(".npmrc.bak", ".npmrc");
          }
        }
      });
    }
    exports.default = default_1;
    function pruneShrinkwrap(inDir) {
      const shrinkwrapPath = inDir != null ? path.join(inDir, "npm-shrinkwrap.json") : "npm-shrinkwrap.json";
      const lockfile = JSON.parse(fs.readFileSync(shrinkwrapPath, "utf-8"));
      const filterPkgs = (obj, key) => {
        for (const [pkgName, pkgData] of Object.entries(obj[key])) {
          if (["dev", "extraneous"].some((prop) => pkgData[prop])) {
            delete obj[key][pkgName];
          }
        }
      };
      filterPkgs(lockfile, "packages");
      filterPkgs(lockfile, "dependencies");
      fs.writeFileSync(shrinkwrapPath, JSON.stringify(lockfile, null, 2) + "\n");
    }
  }
});

// packages/npm/lib/success.js
var require_success = __commonJS({
  "packages/npm/lib/success.js"(exports) {
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
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var fs = __importStar(__require("fs"));
    var os = __importStar(__require("os"));
    var path = __importStar(__require("path"));
    var core_1 = require_lib();
    var delay_1 = __importDefault(require_delay());
    var utils = __importStar(require_utils());
    function default_1(context, config) {
      return __awaiter(this, void 0, void 0, function* () {
        if (config.smokeTest && context.releasedPackages.npm != null) {
          context.logger.info("Performing smoke test, installing released package(s)");
          for (const { name, registry } of context.releasedPackages.npm) {
            const tmpDir = path.join(os.tmpdir(), context.ci.build, name);
            fs.mkdirSync(tmpDir, { recursive: true });
            let tries = 0;
            while ((yield utils.npmView(name, registry)) == null && tries < 60) {
              yield (0, delay_1.default)(1e3);
              tries += 1;
            }
            yield core_1.utils.dryRunTask(context, `install ${name} from ${registry}`, () => __awaiter(this, void 0, void 0, function* () {
              yield utils.npmInstall(name, registry, tmpDir);
            }));
            fs.rmdirSync(tmpDir, { recursive: true });
          }
        }
      });
    }
    exports.default = default_1;
  }
});

// packages/npm/lib/version.js
var require_version = __commonJS({
  "packages/npm/lib/version.js"(exports) {
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
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var path = __importStar(__require("path"));
    var find_up_1 = __importDefault(require_find_up());
    var utils = __importStar(require_utils());
    function default_1(context, _config) {
      return __awaiter(this, void 0, void 0, function* () {
        if (context.workspaces != null) {
          context.logger.warn("Cannot run npm version in workspaces");
          return;
        }
        yield utils.npmVersion(context.version.new);
        context.changedFiles.push("package.json");
        const lockfilePath = yield (0, find_up_1.default)(["npm-shrinkwrap.json", "package-lock.json"]);
        if (lockfilePath != null) {
          context.changedFiles.push(path.relative(context.rootDir, lockfilePath));
        } else {
          context.logger.warn("Could not find lockfile to update version in");
        }
      });
    }
    exports.default = default_1;
  }
});

// packages/npm/lib/index.js
var require_lib2 = __commonJS({
  "packages/npm/lib/index.js"(exports) {
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
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.utils = exports.version = exports.success = exports.publish = exports.init = void 0;
    var init_1 = require_init();
    Object.defineProperty(exports, "init", { enumerable: true, get: function() {
      return __importDefault(init_1).default;
    } });
    var publish_1 = require_publish();
    Object.defineProperty(exports, "publish", { enumerable: true, get: function() {
      return __importDefault(publish_1).default;
    } });
    var success_1 = require_success();
    Object.defineProperty(exports, "success", { enumerable: true, get: function() {
      return __importDefault(success_1).default;
    } });
    var version_1 = require_version();
    Object.defineProperty(exports, "version", { enumerable: true, get: function() {
      return __importDefault(version_1).default;
    } });
    __exportStar(require_config(), exports);
    exports.utils = __importStar(require_utils());
  }
});

export {
  require_lib2 as require_lib
};
