#!/usr/bin/env node
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
import {
  require_github
} from "./chunk-OMMCYZZC.mjs";
import {
  require_lib as require_lib2
} from "./chunk-XOYOLRFM.mjs";
import {
  require_find_up
} from "./chunk-2CUC3JOI.mjs";
import "./chunk-AXJXD5ZX.mjs";
import {
  require_lib
} from "./chunk-JJLY7FXJ.mjs";
import {
  require_dist_node
} from "./chunk-QAZ5FMEW.mjs";
import {
  require_core
} from "./chunk-S4LJCPE2.mjs";
import {
  require_exec
} from "./chunk-X2EBWIRY.mjs";
import {
  __async,
  __commonJS,
  __esm,
  __export,
  __require,
  __spreadProps,
  __spreadValues,
  __toCommonJS,
  __toESM
} from "./chunk-R3TGK222.mjs";

// packages/git/lib/utils.js
var require_utils = __commonJS({
  "packages/git/lib/utils.js"(exports) {
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
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.gitTag = exports.gitPush = exports.gitConfig = exports.gitCommit = exports.gitAdd = void 0;
    var fs5 = __importStar(__require("fs"));
    var os = __importStar(__require("os"));
    var path2 = __importStar(__require("path"));
    var url = __importStar(__require("url"));
    var exec3 = __importStar(require_exec());
    function gitAdd(...files) {
      return __awaiter(this, void 0, void 0, function* () {
        yield exec3.exec("git", ["add", ...files]);
      });
    }
    exports.gitAdd = gitAdd;
    function gitCommit(message, amend) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!amend) {
          const cmdOutput = yield exec3.getExecOutput("git", ["diff", "--name-only", "--cached"]);
          if (cmdOutput.stdout.trim().length == 0) {
            return false;
          }
        }
        const cmdArgs = ["commit", "-s", "-m", message.includes("[ci skip]") ? message : `${message} [ci skip]`];
        if (amend) {
          cmdArgs.push("--amend");
        }
        yield exec3.exec("git", cmdArgs);
        return true;
      });
    }
    exports.gitCommit = gitCommit;
    function gitConfig(context3) {
      return __awaiter(this, void 0, void 0, function* () {
        yield exec3.exec("git", ["config", "--global", "user.name", context3.env.GIT_COMMITTER_NAME]);
        yield exec3.exec("git", ["config", "--global", "user.email", context3.env.GIT_COMMITTER_EMAIL]);
        if (context3.env.GIT_CREDENTIALS != null) {
          yield exec3.exec("git", ["config", "--global", "credential.helper", "store"]);
          const cmdOutput = yield exec3.getExecOutput("git", ["config", "--get", "remote.origin.url"]);
          const gitUrl = new url.URL(cmdOutput.stdout);
          fs5.appendFileSync(path2.join(os.homedir(), ".git-credentials"), `${gitUrl.protocol}//${context3.env.GIT_CREDENTIALS}@${gitUrl.host}`);
        }
        yield exec3.exec("git", ["ls-remote", "--heads", "origin", context3.branch.name]);
      });
    }
    exports.gitConfig = gitConfig;
    function gitPush(context3, branch, tags) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!tags) {
          const cmdOutput = yield exec3.getExecOutput("git", ["cherry"]);
          if (cmdOutput.stdout.trim().length == 0) {
            return false;
          }
        }
        const cmdArgs = ["push", "-u", "origin", branch];
        if (tags) {
          cmdArgs.push("--follow-tags");
        }
        if (context3.dryRun) {
          cmdArgs.push("--dry-run");
        }
        yield exec3.exec("git", cmdArgs);
        return true;
      });
    }
    exports.gitPush = gitPush;
    function gitTag(tagName, message) {
      return __awaiter(this, void 0, void 0, function* () {
        const cmdOutput = yield exec3.getExecOutput("git", ["tag", "-l", tagName]);
        if (cmdOutput.stdout.trim().length > 0) {
          return false;
        }
        const cmdArgs = ["tag", tagName];
        if (message != null) {
          cmdArgs.push("-a", "-m", message);
        }
        yield exec3.exec("git", cmdArgs);
        return true;
      });
    }
    exports.gitTag = gitTag;
  }
});

// packages/git/lib/init.js
var require_init = __commonJS({
  "packages/git/lib/init.js"(exports) {
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
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils = __importStar(require_utils());
    function default_1(context3, _config) {
      return __awaiter(this, void 0, void 0, function* () {
        if (context3.env.GIT_COMMITTER_NAME == null) {
          throw new Error("Required environment variable GIT_COMMITTER_NAME is undefined");
        }
        if (context3.env.GIT_COMMITTER_EMAIL == null) {
          throw new Error("Required environment variable GIT_COMMITTER_EMAIL is undefined");
        }
        yield utils.gitConfig(context3);
      });
    }
    exports.default = default_1;
  }
});

// packages/git/lib/version.js
var require_version = __commonJS({
  "packages/git/lib/version.js"(exports) {
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
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils = __importStar(require_utils());
    function default_1(context3, config) {
      return __awaiter(this, void 0, void 0, function* () {
        const commitMessage = config.commitMessage || "Bump version to {{version}}";
        let tagMessage = config.tagMessage || context3.branch.channel && `Release {{version}} to ${context3.branch.channel}`;
        yield utils.gitAdd(...new Set(context3.changedFiles));
        let shouldPush = false;
        if (yield utils.gitCommit(commitMessage.replace("{{version}}", context3.version.new))) {
          shouldPush = true;
        } else {
          context3.logger.warn("Nothing to commit");
        }
        tagMessage = tagMessage === null || tagMessage === void 0 ? void 0 : tagMessage.replace("{{version}}", context3.version.new);
        if (yield utils.gitTag(context3.tagPrefix + context3.version.new, tagMessage)) {
          shouldPush = true;
        } else {
          context3.logger.warn("Git tag already exists");
        }
        if (!shouldPush || !(yield utils.gitPush(context3, context3.branch.name, true))) {
          context3.logger.warn("Nothing to push");
        }
      });
    }
    exports.default = default_1;
  }
});

// packages/git/lib/config.js
var require_config = __commonJS({
  "packages/git/lib/config.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// packages/git/lib/index.js
var require_lib3 = __commonJS({
  "packages/git/lib/index.js"(exports) {
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
    exports.utils = exports.version = exports.init = void 0;
    var init_1 = require_init();
    Object.defineProperty(exports, "init", { enumerable: true, get: function() {
      return __importDefault(init_1).default;
    } });
    var version_1 = require_version();
    Object.defineProperty(exports, "version", { enumerable: true, get: function() {
      return __importDefault(version_1).default;
    } });
    __exportStar(require_config(), exports);
    exports.utils = __importStar(require_utils());
  }
});

// node_modules/pluralize/pluralize.js
var require_pluralize = __commonJS({
  "node_modules/pluralize/pluralize.js"(exports, module) {
    (function(root, pluralize) {
      if (typeof __require === "function" && typeof exports === "object" && typeof module === "object") {
        module.exports = pluralize();
      } else if (typeof define === "function" && define.amd) {
        define(function() {
          return pluralize();
        });
      } else {
        root.pluralize = pluralize();
      }
    })(exports, function() {
      var pluralRules = [];
      var singularRules = [];
      var uncountables = {};
      var irregularPlurals = {};
      var irregularSingles = {};
      function sanitizeRule(rule) {
        if (typeof rule === "string") {
          return new RegExp("^" + rule + "$", "i");
        }
        return rule;
      }
      function restoreCase(word, token) {
        if (word === token)
          return token;
        if (word === word.toLowerCase())
          return token.toLowerCase();
        if (word === word.toUpperCase())
          return token.toUpperCase();
        if (word[0] === word[0].toUpperCase()) {
          return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
        }
        return token.toLowerCase();
      }
      function interpolate(str, args) {
        return str.replace(/\$(\d{1,2})/g, function(match, index) {
          return args[index] || "";
        });
      }
      function replace(word, rule) {
        return word.replace(rule[0], function(match, index) {
          var result = interpolate(rule[1], arguments);
          if (match === "") {
            return restoreCase(word[index - 1], result);
          }
          return restoreCase(match, result);
        });
      }
      function sanitizeWord(token, word, rules) {
        if (!token.length || uncountables.hasOwnProperty(token)) {
          return word;
        }
        var len = rules.length;
        while (len--) {
          var rule = rules[len];
          if (rule[0].test(word))
            return replace(word, rule);
        }
        return word;
      }
      function replaceWord(replaceMap, keepMap, rules) {
        return function(word) {
          var token = word.toLowerCase();
          if (keepMap.hasOwnProperty(token)) {
            return restoreCase(word, token);
          }
          if (replaceMap.hasOwnProperty(token)) {
            return restoreCase(word, replaceMap[token]);
          }
          return sanitizeWord(token, word, rules);
        };
      }
      function checkWord(replaceMap, keepMap, rules, bool) {
        return function(word) {
          var token = word.toLowerCase();
          if (keepMap.hasOwnProperty(token))
            return true;
          if (replaceMap.hasOwnProperty(token))
            return false;
          return sanitizeWord(token, token, rules) === token;
        };
      }
      function pluralize(word, count, inclusive) {
        var pluralized = count === 1 ? pluralize.singular(word) : pluralize.plural(word);
        return (inclusive ? count + " " : "") + pluralized;
      }
      pluralize.plural = replaceWord(
        irregularSingles,
        irregularPlurals,
        pluralRules
      );
      pluralize.isPlural = checkWord(
        irregularSingles,
        irregularPlurals,
        pluralRules
      );
      pluralize.singular = replaceWord(
        irregularPlurals,
        irregularSingles,
        singularRules
      );
      pluralize.isSingular = checkWord(
        irregularPlurals,
        irregularSingles,
        singularRules
      );
      pluralize.addPluralRule = function(rule, replacement) {
        pluralRules.push([sanitizeRule(rule), replacement]);
      };
      pluralize.addSingularRule = function(rule, replacement) {
        singularRules.push([sanitizeRule(rule), replacement]);
      };
      pluralize.addUncountableRule = function(word) {
        if (typeof word === "string") {
          uncountables[word.toLowerCase()] = true;
          return;
        }
        pluralize.addPluralRule(word, "$0");
        pluralize.addSingularRule(word, "$0");
      };
      pluralize.addIrregularRule = function(single, plural) {
        plural = plural.toLowerCase();
        single = single.toLowerCase();
        irregularSingles[single] = plural;
        irregularPlurals[plural] = single;
      };
      [
        // Pronouns.
        ["I", "we"],
        ["me", "us"],
        ["he", "they"],
        ["she", "they"],
        ["them", "them"],
        ["myself", "ourselves"],
        ["yourself", "yourselves"],
        ["itself", "themselves"],
        ["herself", "themselves"],
        ["himself", "themselves"],
        ["themself", "themselves"],
        ["is", "are"],
        ["was", "were"],
        ["has", "have"],
        ["this", "these"],
        ["that", "those"],
        // Words ending in with a consonant and `o`.
        ["echo", "echoes"],
        ["dingo", "dingoes"],
        ["volcano", "volcanoes"],
        ["tornado", "tornadoes"],
        ["torpedo", "torpedoes"],
        // Ends with `us`.
        ["genus", "genera"],
        ["viscus", "viscera"],
        // Ends with `ma`.
        ["stigma", "stigmata"],
        ["stoma", "stomata"],
        ["dogma", "dogmata"],
        ["lemma", "lemmata"],
        ["schema", "schemata"],
        ["anathema", "anathemata"],
        // Other irregular rules.
        ["ox", "oxen"],
        ["axe", "axes"],
        ["die", "dice"],
        ["yes", "yeses"],
        ["foot", "feet"],
        ["eave", "eaves"],
        ["goose", "geese"],
        ["tooth", "teeth"],
        ["quiz", "quizzes"],
        ["human", "humans"],
        ["proof", "proofs"],
        ["carve", "carves"],
        ["valve", "valves"],
        ["looey", "looies"],
        ["thief", "thieves"],
        ["groove", "grooves"],
        ["pickaxe", "pickaxes"],
        ["passerby", "passersby"]
      ].forEach(function(rule) {
        return pluralize.addIrregularRule(rule[0], rule[1]);
      });
      [
        [/s?$/i, "s"],
        [/[^\u0000-\u007F]$/i, "$0"],
        [/([^aeiou]ese)$/i, "$1"],
        [/(ax|test)is$/i, "$1es"],
        [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, "$1es"],
        [/(e[mn]u)s?$/i, "$1s"],
        [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, "$1"],
        [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, "$1i"],
        [/(alumn|alg|vertebr)(?:a|ae)$/i, "$1ae"],
        [/(seraph|cherub)(?:im)?$/i, "$1im"],
        [/(her|at|gr)o$/i, "$1oes"],
        [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, "$1a"],
        [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, "$1a"],
        [/sis$/i, "ses"],
        [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, "$1$2ves"],
        [/([^aeiouy]|qu)y$/i, "$1ies"],
        [/([^ch][ieo][ln])ey$/i, "$1ies"],
        [/(x|ch|ss|sh|zz)$/i, "$1es"],
        [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, "$1ices"],
        [/\b((?:tit)?m|l)(?:ice|ouse)$/i, "$1ice"],
        [/(pe)(?:rson|ople)$/i, "$1ople"],
        [/(child)(?:ren)?$/i, "$1ren"],
        [/eaux$/i, "$0"],
        [/m[ae]n$/i, "men"],
        ["thou", "you"]
      ].forEach(function(rule) {
        return pluralize.addPluralRule(rule[0], rule[1]);
      });
      [
        [/s$/i, ""],
        [/(ss)$/i, "$1"],
        [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, "$1fe"],
        [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, "$1f"],
        [/ies$/i, "y"],
        [/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i, "$1ie"],
        [/\b(mon|smil)ies$/i, "$1ey"],
        [/\b((?:tit)?m|l)ice$/i, "$1ouse"],
        [/(seraph|cherub)im$/i, "$1"],
        [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, "$1"],
        [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, "$1sis"],
        [/(movie|twelve|abuse|e[mn]u)s$/i, "$1"],
        [/(test)(?:is|es)$/i, "$1is"],
        [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, "$1us"],
        [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, "$1um"],
        [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, "$1on"],
        [/(alumn|alg|vertebr)ae$/i, "$1a"],
        [/(cod|mur|sil|vert|ind)ices$/i, "$1ex"],
        [/(matr|append)ices$/i, "$1ix"],
        [/(pe)(rson|ople)$/i, "$1rson"],
        [/(child)ren$/i, "$1"],
        [/(eau)x?$/i, "$1"],
        [/men$/i, "man"]
      ].forEach(function(rule) {
        return pluralize.addSingularRule(rule[0], rule[1]);
      });
      [
        // Singular words with no plurals.
        "adulthood",
        "advice",
        "agenda",
        "aid",
        "aircraft",
        "alcohol",
        "ammo",
        "analytics",
        "anime",
        "athletics",
        "audio",
        "bison",
        "blood",
        "bream",
        "buffalo",
        "butter",
        "carp",
        "cash",
        "chassis",
        "chess",
        "clothing",
        "cod",
        "commerce",
        "cooperation",
        "corps",
        "debris",
        "diabetes",
        "digestion",
        "elk",
        "energy",
        "equipment",
        "excretion",
        "expertise",
        "firmware",
        "flounder",
        "fun",
        "gallows",
        "garbage",
        "graffiti",
        "hardware",
        "headquarters",
        "health",
        "herpes",
        "highjinks",
        "homework",
        "housework",
        "information",
        "jeans",
        "justice",
        "kudos",
        "labour",
        "literature",
        "machinery",
        "mackerel",
        "mail",
        "media",
        "mews",
        "moose",
        "music",
        "mud",
        "manga",
        "news",
        "only",
        "personnel",
        "pike",
        "plankton",
        "pliers",
        "police",
        "pollution",
        "premises",
        "rain",
        "research",
        "rice",
        "salmon",
        "scissors",
        "series",
        "sewage",
        "shambles",
        "shrimp",
        "software",
        "species",
        "staff",
        "swine",
        "tennis",
        "traffic",
        "transportation",
        "trout",
        "tuna",
        "wealth",
        "welfare",
        "whiting",
        "wildebeest",
        "wildlife",
        "you",
        /pok[eé]mon$/i,
        // Regexes.
        /[^aeiou]ese$/i,
        // "chinese", "japanese"
        /deer$/i,
        // "deer", "reindeer"
        /fish$/i,
        // "fish", "blowfish", "angelfish"
        /measles$/i,
        /o[iu]s$/i,
        // "carnivorous"
        /pox$/i,
        // "chickpox", "smallpox"
        /sheep$/i
      ].forEach(pluralize.addUncountableRule);
      return pluralize;
    });
  }
});

// packages/run-script/scripts/npmUpdate.ts
var npmUpdate_exports = {};
__export(npmUpdate_exports, {
  default: () => npmUpdate_default
});
import * as fs from "fs";
function getDependencies(branch, dev) {
  const dependencies = dev ? branch.devDependencies : branch.dependencies;
  if (!Array.isArray(dependencies)) {
    return dependencies || {};
  }
  const dependencyMap = {};
  for (const pkgName of dependencies) {
    dependencyMap[pkgName] = branch.channel || "latest";
  }
  return dependencyMap;
}
function updateDependency(pkgName, pkgTag, dev) {
  return __async(this, null, function* () {
    const lockfile = JSON.parse(fs.readFileSync(lockfilePath, "utf-8"));
    const currentVersion = lockfile.dependencies[pkgName].version;
    if (resolutions[pkgName] == null) {
      resolutions[pkgName] = (yield exec.getExecOutput(
        "npm",
        ["view", `${pkgName}@${pkgTag}`, "version"]
      )).stdout.trim();
    }
    const latestVersion = resolutions[pkgName];
    if (currentVersion !== latestVersion) {
      const npmArgs = dev ? ["--save-dev"] : ["--save-prod", "--save-exact"];
      yield exec.exec("npm", ["install", `${pkgName}@${latestVersion}`, ...npmArgs]);
      updateDetails.push(`${pkgName}: ${currentVersion} -> ${latestVersion}`);
    }
  });
}
function npmUpdate_default(context3) {
  return __async(this, null, function* () {
    const branchConfig = context3.branch;
    if (branchConfig.dependencies == null && branchConfig.devDependencies == null) {
      return;
    }
    const pluralize = require_pluralize();
    const dependencies = getDependencies(branchConfig, false);
    const devDependencies = getDependencies(branchConfig, true);
    const changedFiles = ["package.json", lockfilePath];
    context3.logger.info(`Checking for updates to ${pluralize("dependency", Object.keys(dependencies).length, true)} and ${pluralize("dev dependency", Object.keys(devDependencies).length, true)}`);
    if (context3.env.NPM_RESOLUTIONS) {
      resolutions = JSON.parse(context3.env.NPM_RESOLUTIONS);
      if (Object.keys(resolutions).length === 0) {
        return;
      }
    }
    if (branchConfig.dependencies != null) {
      for (const [pkgName, pkgTag] of Object.entries(dependencies)) {
        yield updateDependency(pkgName, pkgTag, false);
      }
    }
    if (branchConfig.devDependencies) {
      for (const [pkgName, pkgTag] of Object.entries(devDependencies)) {
        yield updateDependency(pkgName, pkgTag, true);
      }
    }
    if (!context3.env.NPM_RESOLUTIONS) {
      core.setOutput("result", JSON.stringify(resolutions));
    }
    if (updateDetails.length > 0) {
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
      if (packageJson.workspaces != null) {
        changedFiles.push("**/package.json");
        const dependencyList = [...Object.keys(dependencies), ...Object.keys(devDependencies)];
        yield exec.exec("npx", [
          "-y",
          "--",
          "syncpack",
          "fix-mismatches",
          "--dev",
          "--prod",
          "--filter",
          dependencyList.join("|")
        ]);
        yield exec.exec("git", ["checkout", lockfilePath]);
        yield exec.exec("npm", ["install"]);
      }
      if (context3.env.GIT_COMMITTER_NAME !== null && context3.env.GIT_COMMITTER_EMAIL !== null) {
        yield import_git.utils.gitConfig(context3);
        yield import_git.utils.gitAdd(...changedFiles);
        yield import_git.utils.gitCommit("Update dependencies [ci skip]\n\n" + updateDetails.join("\n"));
      }
    }
  });
}
var core, exec, import_git, lockfilePath, updateDetails, resolutions;
var init_npmUpdate = __esm({
  "packages/run-script/scripts/npmUpdate.ts"() {
    "use strict";
    core = __toESM(require_core());
    exec = __toESM(require_exec());
    import_git = __toESM(require_lib3());
    lockfilePath = fs.existsSync("npm-shrinkwrap.json") ? "npm-shrinkwrap.json" : "package-lock.json";
    updateDetails = [];
    resolutions = {};
  }
});

// packages/lerna/lib/init.js
var require_init2 = __commonJS({
  "packages/lerna/lib/init.js"(exports) {
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
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var fs5 = __importStar(__require("fs"));
    var npm_1 = require_lib2();
    function default_1(context3, config) {
      var _a;
      return __awaiter(this, void 0, void 0, function* () {
        let publishConfig;
        try {
          const lernaJson = JSON.parse(fs5.readFileSync("lerna.json", "utf-8"));
          context3.version.new = lernaJson.version;
          publishConfig = (_a = lernaJson.command) === null || _a === void 0 ? void 0 : _a.publish;
        } catch (_b) {
          throw new Error(`Missing or invalid lerna.json in branch ${context3.branch.name}`);
        }
        try {
          const packageJson = JSON.parse(fs5.readFileSync("package.json", "utf-8"));
          context3.workspaces = packageJson.workspaces;
          if (publishConfig == null) {
            publishConfig = packageJson.publishConfig;
          }
        } catch (_c) {
          throw new Error(`Missing or invalid package.json in branch ${context3.branch.name}`);
        }
        context3.branch.channel = context3.branch.channel || "latest";
        if (config.npmPublish === false) {
          return;
        }
        const useTokenAuth = npm_1.utils.verifyConditions(context3);
        yield npm_1.utils.npmConfig(context3, (publishConfig === null || publishConfig === void 0 ? void 0 : publishConfig.registry) || npm_1.DEFAULT_NPM_REGISTRY, useTokenAuth);
      });
    }
    exports.default = default_1;
  }
});

// packages/lerna/lib/utils.js
var require_utils2 = __commonJS({
  "packages/lerna/lib/utils.js"(exports) {
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
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.lernaVersion = exports.lernaList = void 0;
    var fs5 = __importStar(__require("fs"));
    var exec3 = __importStar(require_exec());
    function lernaList(onlyChanged) {
      return __awaiter(this, void 0, void 0, function* () {
        let cmdOutput = yield exec3.getExecOutput("npx", ["lerna", "list", "--json", "--toposort"]);
        const packageInfo = JSON.parse(cmdOutput.stdout);
        if (onlyChanged) {
          cmdOutput = yield exec3.getExecOutput("npx", ["lerna", "changed", "--include-merged-tags"], { ignoreReturnCode: true });
          const changedPackages = cmdOutput.stdout.split(/\r?\n/);
          return packageInfo.filter((pkg) => changedPackages.includes(pkg.name));
        }
        return packageInfo;
      });
    }
    exports.lernaList = lernaList;
    function lernaVersion2(newVersion) {
      return __awaiter(this, void 0, void 0, function* () {
        yield exec3.exec("npx", [
          "lerna",
          "version",
          newVersion,
          "--exact",
          "--include-merged-tags",
          "--no-git-tag-version",
          "--yes"
        ]);
        if (!fs5.existsSync("yarn.lock")) {
          yield exec3.exec("npm", ["install", "--package-lock-only", "--ignore-scripts", "--no-audit"]);
        }
      });
    }
    exports.lernaVersion = lernaVersion2;
  }
});

// packages/lerna/lib/publish.js
var require_publish = __commonJS({
  "packages/lerna/lib/publish.js"(exports) {
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
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var npm_1 = require_lib2();
    var utils = __importStar(require_utils2());
    function default_1(context3, config) {
      return __awaiter(this, void 0, void 0, function* () {
        for (const { name, location } of yield utils.lernaList()) {
          const tempConfig = Object.assign({}, config);
          if (Array.isArray(config.pruneShrinkwrap)) {
            tempConfig.pruneShrinkwrap = config.pruneShrinkwrap.includes(name);
          }
          yield (0, npm_1.publish)(context3, tempConfig, location);
        }
      });
    }
    exports.default = default_1;
  }
});

// packages/lerna/lib/success.js
var require_success = __commonJS({
  "packages/lerna/lib/success.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var npm_1 = require_lib2();
    function default_1(context3, config) {
      return __awaiter(this, void 0, void 0, function* () {
        yield (0, npm_1.success)(context3, config);
      });
    }
    exports.default = default_1;
  }
});

// packages/lerna/lib/version.js
var require_version2 = __commonJS({
  "packages/lerna/lib/version.js"(exports) {
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
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
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
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var path2 = __importStar(__require("path"));
    var find_up_1 = __importDefault(require_find_up());
    var utils = __importStar(require_utils2());
    function default_1(context3, _config) {
      return __awaiter(this, void 0, void 0, function* () {
        const packageInfo = yield utils.lernaList(true);
        yield utils.lernaVersion(context3.version.new);
        context3.changedFiles.push("lerna.json", "package.json");
        const lockfilePath2 = yield (0, find_up_1.default)(["yarn.lock", "npm-shrinkwrap.json", "package-lock.json"]);
        if (lockfilePath2 != null) {
          context3.changedFiles.push(path2.relative(context3.rootDir, lockfilePath2));
        } else {
          context3.logger.warn("Could not find lockfile to update version in");
        }
        for (const { location } of packageInfo) {
          const relLocation = path2.relative(context3.rootDir, location);
          context3.changedFiles.push(path2.join(relLocation, "package.json"));
        }
      });
    }
    exports.default = default_1;
  }
});

// packages/lerna/lib/config.js
var require_config2 = __commonJS({
  "packages/lerna/lib/config.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// packages/lerna/lib/index.js
var require_lib4 = __commonJS({
  "packages/lerna/lib/index.js"(exports) {
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
    var init_1 = require_init2();
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
    var version_1 = require_version2();
    Object.defineProperty(exports, "version", { enumerable: true, get: function() {
      return __importDefault(version_1).default;
    } });
    __exportStar(require_config2(), exports);
    exports.utils = __importStar(require_utils2());
  }
});

// packages/run-script/node_modules/semver/semver.js
var require_semver = __commonJS({
  "packages/run-script/node_modules/semver/semver.js"(exports, module) {
    exports = module.exports = SemVer;
    var debug;
    if (typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
      debug = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift("SEMVER");
        console.log.apply(console, args);
      };
    } else {
      debug = function() {
      };
    }
    exports.SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var re = exports.re = [];
    var src = exports.src = [];
    var t = exports.tokens = {};
    var R = 0;
    function tok(n) {
      t[n] = R++;
    }
    tok("NUMERICIDENTIFIER");
    src[t.NUMERICIDENTIFIER] = "0|[1-9]\\d*";
    tok("NUMERICIDENTIFIERLOOSE");
    src[t.NUMERICIDENTIFIERLOOSE] = "[0-9]+";
    tok("NONNUMERICIDENTIFIER");
    src[t.NONNUMERICIDENTIFIER] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
    tok("MAINVERSION");
    src[t.MAINVERSION] = "(" + src[t.NUMERICIDENTIFIER] + ")\\.(" + src[t.NUMERICIDENTIFIER] + ")\\.(" + src[t.NUMERICIDENTIFIER] + ")";
    tok("MAINVERSIONLOOSE");
    src[t.MAINVERSIONLOOSE] = "(" + src[t.NUMERICIDENTIFIERLOOSE] + ")\\.(" + src[t.NUMERICIDENTIFIERLOOSE] + ")\\.(" + src[t.NUMERICIDENTIFIERLOOSE] + ")";
    tok("PRERELEASEIDENTIFIER");
    src[t.PRERELEASEIDENTIFIER] = "(?:" + src[t.NUMERICIDENTIFIER] + "|" + src[t.NONNUMERICIDENTIFIER] + ")";
    tok("PRERELEASEIDENTIFIERLOOSE");
    src[t.PRERELEASEIDENTIFIERLOOSE] = "(?:" + src[t.NUMERICIDENTIFIERLOOSE] + "|" + src[t.NONNUMERICIDENTIFIER] + ")";
    tok("PRERELEASE");
    src[t.PRERELEASE] = "(?:-(" + src[t.PRERELEASEIDENTIFIER] + "(?:\\." + src[t.PRERELEASEIDENTIFIER] + ")*))";
    tok("PRERELEASELOOSE");
    src[t.PRERELEASELOOSE] = "(?:-?(" + src[t.PRERELEASEIDENTIFIERLOOSE] + "(?:\\." + src[t.PRERELEASEIDENTIFIERLOOSE] + ")*))";
    tok("BUILDIDENTIFIER");
    src[t.BUILDIDENTIFIER] = "[0-9A-Za-z-]+";
    tok("BUILD");
    src[t.BUILD] = "(?:\\+(" + src[t.BUILDIDENTIFIER] + "(?:\\." + src[t.BUILDIDENTIFIER] + ")*))";
    tok("FULL");
    tok("FULLPLAIN");
    src[t.FULLPLAIN] = "v?" + src[t.MAINVERSION] + src[t.PRERELEASE] + "?" + src[t.BUILD] + "?";
    src[t.FULL] = "^" + src[t.FULLPLAIN] + "$";
    tok("LOOSEPLAIN");
    src[t.LOOSEPLAIN] = "[v=\\s]*" + src[t.MAINVERSIONLOOSE] + src[t.PRERELEASELOOSE] + "?" + src[t.BUILD] + "?";
    tok("LOOSE");
    src[t.LOOSE] = "^" + src[t.LOOSEPLAIN] + "$";
    tok("GTLT");
    src[t.GTLT] = "((?:<|>)?=?)";
    tok("XRANGEIDENTIFIERLOOSE");
    src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + "|x|X|\\*";
    tok("XRANGEIDENTIFIER");
    src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + "|x|X|\\*";
    tok("XRANGEPLAIN");
    src[t.XRANGEPLAIN] = "[v=\\s]*(" + src[t.XRANGEIDENTIFIER] + ")(?:\\.(" + src[t.XRANGEIDENTIFIER] + ")(?:\\.(" + src[t.XRANGEIDENTIFIER] + ")(?:" + src[t.PRERELEASE] + ")?" + src[t.BUILD] + "?)?)?";
    tok("XRANGEPLAINLOOSE");
    src[t.XRANGEPLAINLOOSE] = "[v=\\s]*(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:\\.(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:\\.(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:" + src[t.PRERELEASELOOSE] + ")?" + src[t.BUILD] + "?)?)?";
    tok("XRANGE");
    src[t.XRANGE] = "^" + src[t.GTLT] + "\\s*" + src[t.XRANGEPLAIN] + "$";
    tok("XRANGELOOSE");
    src[t.XRANGELOOSE] = "^" + src[t.GTLT] + "\\s*" + src[t.XRANGEPLAINLOOSE] + "$";
    tok("COERCE");
    src[t.COERCE] = "(^|[^\\d])(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "})(?:\\.(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "}))?(?:\\.(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "}))?(?:$|[^\\d])";
    tok("COERCERTL");
    re[t.COERCERTL] = new RegExp(src[t.COERCE], "g");
    tok("LONETILDE");
    src[t.LONETILDE] = "(?:~>?)";
    tok("TILDETRIM");
    src[t.TILDETRIM] = "(\\s*)" + src[t.LONETILDE] + "\\s+";
    re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], "g");
    var tildeTrimReplace = "$1~";
    tok("TILDE");
    src[t.TILDE] = "^" + src[t.LONETILDE] + src[t.XRANGEPLAIN] + "$";
    tok("TILDELOOSE");
    src[t.TILDELOOSE] = "^" + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + "$";
    tok("LONECARET");
    src[t.LONECARET] = "(?:\\^)";
    tok("CARETTRIM");
    src[t.CARETTRIM] = "(\\s*)" + src[t.LONECARET] + "\\s+";
    re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], "g");
    var caretTrimReplace = "$1^";
    tok("CARET");
    src[t.CARET] = "^" + src[t.LONECARET] + src[t.XRANGEPLAIN] + "$";
    tok("CARETLOOSE");
    src[t.CARETLOOSE] = "^" + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + "$";
    tok("COMPARATORLOOSE");
    src[t.COMPARATORLOOSE] = "^" + src[t.GTLT] + "\\s*(" + src[t.LOOSEPLAIN] + ")$|^$";
    tok("COMPARATOR");
    src[t.COMPARATOR] = "^" + src[t.GTLT] + "\\s*(" + src[t.FULLPLAIN] + ")$|^$";
    tok("COMPARATORTRIM");
    src[t.COMPARATORTRIM] = "(\\s*)" + src[t.GTLT] + "\\s*(" + src[t.LOOSEPLAIN] + "|" + src[t.XRANGEPLAIN] + ")";
    re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], "g");
    var comparatorTrimReplace = "$1$2$3";
    tok("HYPHENRANGE");
    src[t.HYPHENRANGE] = "^\\s*(" + src[t.XRANGEPLAIN] + ")\\s+-\\s+(" + src[t.XRANGEPLAIN] + ")\\s*$";
    tok("HYPHENRANGELOOSE");
    src[t.HYPHENRANGELOOSE] = "^\\s*(" + src[t.XRANGEPLAINLOOSE] + ")\\s+-\\s+(" + src[t.XRANGEPLAINLOOSE] + ")\\s*$";
    tok("STAR");
    src[t.STAR] = "(<|>)?=?\\s*\\*";
    for (i = 0; i < R; i++) {
      debug(i, src[i]);
      if (!re[i]) {
        re[i] = new RegExp(src[i]);
      }
    }
    var i;
    exports.parse = parse;
    function parse(version, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version !== "string") {
        return null;
      }
      if (version.length > MAX_LENGTH) {
        return null;
      }
      var r = options.loose ? re[t.LOOSE] : re[t.FULL];
      if (!r.test(version)) {
        return null;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        return null;
      }
    }
    exports.valid = valid;
    function valid(version, options) {
      var v = parse(version, options);
      return v ? v.version : null;
    }
    exports.clean = clean;
    function clean(version, options) {
      var s = parse(version.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    }
    exports.SemVer = SemVer;
    function SemVer(version, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (version instanceof SemVer) {
        if (version.loose === options.loose) {
          return version;
        } else {
          version = version.version;
        }
      } else if (typeof version !== "string") {
        throw new TypeError("Invalid Version: " + version);
      }
      if (version.length > MAX_LENGTH) {
        throw new TypeError("version is longer than " + MAX_LENGTH + " characters");
      }
      if (!(this instanceof SemVer)) {
        return new SemVer(version, options);
      }
      debug("SemVer", version, options);
      this.options = options;
      this.loose = !!options.loose;
      var m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
      if (!m) {
        throw new TypeError("Invalid Version: " + version);
      }
      this.raw = version;
      this.major = +m[1];
      this.minor = +m[2];
      this.patch = +m[3];
      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError("Invalid major version");
      }
      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError("Invalid minor version");
      }
      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError("Invalid patch version");
      }
      if (!m[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = m[4].split(".").map(function(id) {
          if (/^[0-9]+$/.test(id)) {
            var num = +id;
            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num;
            }
          }
          return id;
        });
      }
      this.build = m[5] ? m[5].split(".") : [];
      this.format();
    }
    SemVer.prototype.format = function() {
      this.version = this.major + "." + this.minor + "." + this.patch;
      if (this.prerelease.length) {
        this.version += "-" + this.prerelease.join(".");
      }
      return this.version;
    };
    SemVer.prototype.toString = function() {
      return this.version;
    };
    SemVer.prototype.compare = function(other) {
      debug("SemVer.compare", this.version, this.options, other);
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      return this.compareMain(other) || this.comparePre(other);
    };
    SemVer.prototype.compareMain = function(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
    };
    SemVer.prototype.comparePre = function(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      if (this.prerelease.length && !other.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0;
      }
      var i2 = 0;
      do {
        var a = this.prerelease[i2];
        var b = other.prerelease[i2];
        debug("prerelease compare", i2, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i2);
    };
    SemVer.prototype.compareBuild = function(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      var i2 = 0;
      do {
        var a = this.build[i2];
        var b = other.build[i2];
        debug("prerelease compare", i2, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i2);
    };
    SemVer.prototype.inc = function(release, identifier) {
      switch (release) {
        case "premajor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc("pre", identifier);
          break;
        case "preminor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc("pre", identifier);
          break;
        case "prepatch":
          this.prerelease.length = 0;
          this.inc("patch", identifier);
          this.inc("pre", identifier);
          break;
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", identifier);
          }
          this.inc("pre", identifier);
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break;
        case "pre":
          if (this.prerelease.length === 0) {
            this.prerelease = [0];
          } else {
            var i2 = this.prerelease.length;
            while (--i2 >= 0) {
              if (typeof this.prerelease[i2] === "number") {
                this.prerelease[i2]++;
                i2 = -2;
              }
            }
            if (i2 === -1) {
              this.prerelease.push(0);
            }
          }
          if (identifier) {
            if (this.prerelease[0] === identifier) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = [identifier, 0];
              }
            } else {
              this.prerelease = [identifier, 0];
            }
          }
          break;
        default:
          throw new Error("invalid increment argument: " + release);
      }
      this.format();
      this.raw = this.version;
      return this;
    };
    exports.inc = inc;
    function inc(version, release, loose, identifier) {
      if (typeof loose === "string") {
        identifier = loose;
        loose = void 0;
      }
      try {
        return new SemVer(version, loose).inc(release, identifier).version;
      } catch (er) {
        return null;
      }
    }
    exports.diff = diff;
    function diff(version1, version2) {
      if (eq(version1, version2)) {
        return null;
      } else {
        var v1 = parse(version1);
        var v2 = parse(version2);
        var prefix = "";
        if (v1.prerelease.length || v2.prerelease.length) {
          prefix = "pre";
          var defaultResult = "prerelease";
        }
        for (var key in v1) {
          if (key === "major" || key === "minor" || key === "patch") {
            if (v1[key] !== v2[key]) {
              return prefix + key;
            }
          }
        }
        return defaultResult;
      }
    }
    exports.compareIdentifiers = compareIdentifiers;
    var numeric = /^[0-9]+$/;
    function compareIdentifiers(a, b) {
      var anum = numeric.test(a);
      var bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    }
    exports.rcompareIdentifiers = rcompareIdentifiers;
    function rcompareIdentifiers(a, b) {
      return compareIdentifiers(b, a);
    }
    exports.major = major;
    function major(a, loose) {
      return new SemVer(a, loose).major;
    }
    exports.minor = minor;
    function minor(a, loose) {
      return new SemVer(a, loose).minor;
    }
    exports.patch = patch;
    function patch(a, loose) {
      return new SemVer(a, loose).patch;
    }
    exports.compare = compare;
    function compare(a, b, loose) {
      return new SemVer(a, loose).compare(new SemVer(b, loose));
    }
    exports.compareLoose = compareLoose;
    function compareLoose(a, b) {
      return compare(a, b, true);
    }
    exports.compareBuild = compareBuild;
    function compareBuild(a, b, loose) {
      var versionA = new SemVer(a, loose);
      var versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    }
    exports.rcompare = rcompare;
    function rcompare(a, b, loose) {
      return compare(b, a, loose);
    }
    exports.sort = sort;
    function sort(list, loose) {
      return list.sort(function(a, b) {
        return exports.compareBuild(a, b, loose);
      });
    }
    exports.rsort = rsort;
    function rsort(list, loose) {
      return list.sort(function(a, b) {
        return exports.compareBuild(b, a, loose);
      });
    }
    exports.gt = gt;
    function gt(a, b, loose) {
      return compare(a, b, loose) > 0;
    }
    exports.lt = lt;
    function lt(a, b, loose) {
      return compare(a, b, loose) < 0;
    }
    exports.eq = eq;
    function eq(a, b, loose) {
      return compare(a, b, loose) === 0;
    }
    exports.neq = neq;
    function neq(a, b, loose) {
      return compare(a, b, loose) !== 0;
    }
    exports.gte = gte;
    function gte(a, b, loose) {
      return compare(a, b, loose) >= 0;
    }
    exports.lte = lte;
    function lte(a, b, loose) {
      return compare(a, b, loose) <= 0;
    }
    exports.cmp = cmp;
    function cmp(a, op, b, loose) {
      switch (op) {
        case "===":
          if (typeof a === "object")
            a = a.version;
          if (typeof b === "object")
            b = b.version;
          return a === b;
        case "!==":
          if (typeof a === "object")
            a = a.version;
          if (typeof b === "object")
            b = b.version;
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError("Invalid operator: " + op);
      }
    }
    exports.Comparator = Comparator;
    function Comparator(comp, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (comp instanceof Comparator) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }
      if (!(this instanceof Comparator)) {
        return new Comparator(comp, options);
      }
      debug("comparator", comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);
      if (this.semver === ANY) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      debug("comp", this);
    }
    var ANY = {};
    Comparator.prototype.parse = function(comp) {
      var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
      var m = comp.match(r);
      if (!m) {
        throw new TypeError("Invalid comparator: " + comp);
      }
      this.operator = m[1] !== void 0 ? m[1] : "";
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY;
      } else {
        this.semver = new SemVer(m[2], this.options.loose);
      }
    };
    Comparator.prototype.toString = function() {
      return this.value;
    };
    Comparator.prototype.test = function(version) {
      debug("Comparator.test", version, this.options.loose);
      if (this.semver === ANY || version === ANY) {
        return true;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer(version, this.options);
        } catch (er) {
          return false;
        }
      }
      return cmp(version, this.operator, this.semver, this.options);
    };
    Comparator.prototype.intersects = function(comp, options) {
      if (!(comp instanceof Comparator)) {
        throw new TypeError("a Comparator is required");
      }
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      var rangeTmp;
      if (this.operator === "") {
        if (this.value === "") {
          return true;
        }
        rangeTmp = new Range(comp.value, options);
        return satisfies(this.value, rangeTmp, options);
      } else if (comp.operator === "") {
        if (comp.value === "") {
          return true;
        }
        rangeTmp = new Range(this.value, options);
        return satisfies(comp.semver, rangeTmp, options);
      }
      var sameDirectionIncreasing = (this.operator === ">=" || this.operator === ">") && (comp.operator === ">=" || comp.operator === ">");
      var sameDirectionDecreasing = (this.operator === "<=" || this.operator === "<") && (comp.operator === "<=" || comp.operator === "<");
      var sameSemVer = this.semver.version === comp.semver.version;
      var differentDirectionsInclusive = (this.operator === ">=" || this.operator === "<=") && (comp.operator === ">=" || comp.operator === "<=");
      var oppositeDirectionsLessThan = cmp(this.semver, "<", comp.semver, options) && ((this.operator === ">=" || this.operator === ">") && (comp.operator === "<=" || comp.operator === "<"));
      var oppositeDirectionsGreaterThan = cmp(this.semver, ">", comp.semver, options) && ((this.operator === "<=" || this.operator === "<") && (comp.operator === ">=" || comp.operator === ">"));
      return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
    };
    exports.Range = Range;
    function Range(range, options) {
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false
        };
      }
      if (range instanceof Range) {
        if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
          return range;
        } else {
          return new Range(range.raw, options);
        }
      }
      if (range instanceof Comparator) {
        return new Range(range.value, options);
      }
      if (!(this instanceof Range)) {
        return new Range(range, options);
      }
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      this.raw = range;
      this.set = range.split(/\s*\|\|\s*/).map(function(range2) {
        return this.parseRange(range2.trim());
      }, this).filter(function(c) {
        return c.length;
      });
      if (!this.set.length) {
        throw new TypeError("Invalid SemVer Range: " + range);
      }
      this.format();
    }
    Range.prototype.format = function() {
      this.range = this.set.map(function(comps) {
        return comps.join(" ").trim();
      }).join("||").trim();
      return this.range;
    };
    Range.prototype.toString = function() {
      return this.range;
    };
    Range.prototype.parseRange = function(range) {
      var loose = this.options.loose;
      range = range.trim();
      var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
      range = range.replace(hr, hyphenReplace);
      debug("hyphen replace", range);
      range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
      debug("comparator trim", range, re[t.COMPARATORTRIM]);
      range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
      range = range.replace(re[t.CARETTRIM], caretTrimReplace);
      range = range.split(/\s+/).join(" ");
      var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
      var set = range.split(" ").map(function(comp) {
        return parseComparator(comp, this.options);
      }, this).join(" ").split(/\s+/);
      if (this.options.loose) {
        set = set.filter(function(comp) {
          return !!comp.match(compRe);
        });
      }
      set = set.map(function(comp) {
        return new Comparator(comp, this.options);
      }, this);
      return set;
    };
    Range.prototype.intersects = function(range, options) {
      if (!(range instanceof Range)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some(function(thisComparators) {
        return isSatisfiable(thisComparators, options) && range.set.some(function(rangeComparators) {
          return isSatisfiable(rangeComparators, options) && thisComparators.every(function(thisComparator) {
            return rangeComparators.every(function(rangeComparator) {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    };
    function isSatisfiable(comparators, options) {
      var result = true;
      var remainingComparators = comparators.slice();
      var testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every(function(otherComparator) {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    }
    exports.toComparators = toComparators;
    function toComparators(range, options) {
      return new Range(range, options).set.map(function(comp) {
        return comp.map(function(c) {
          return c.value;
        }).join(" ").trim().split(" ");
      });
    }
    function parseComparator(comp, options) {
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    }
    function isX(id) {
      return !id || id.toLowerCase() === "x" || id === "*";
    }
    function replaceTildes(comp, options) {
      return comp.trim().split(/\s+/).map(function(comp2) {
        return replaceTilde(comp2, options);
      }).join(" ");
    }
    function replaceTilde(comp, options) {
      var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, function(_, M, m, p, pr) {
        debug("tilde", comp, _, M, m, p, pr);
        var ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
        } else if (isX(p)) {
          ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + (+m + 1) + ".0";
        } else {
          ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
        }
        debug("tilde return", ret);
        return ret;
      });
    }
    function replaceCarets(comp, options) {
      return comp.trim().split(/\s+/).map(function(comp2) {
        return replaceCaret(comp2, options);
      }).join(" ");
    }
    function replaceCaret(comp, options) {
      debug("caret", comp, options);
      var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      return comp.replace(r, function(_, M, m, p, pr) {
        debug("caret", comp, _, M, m, p, pr);
        var ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
        } else if (isX(p)) {
          if (M === "0") {
            ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
          } else {
            ret = ">=" + M + "." + m + ".0 <" + (+M + 1) + ".0.0";
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + m + "." + (+p + 1);
            } else {
              ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + (+m + 1) + ".0";
            }
          } else {
            ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + (+M + 1) + ".0.0";
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = ">=" + M + "." + m + "." + p + " <" + M + "." + m + "." + (+p + 1);
            } else {
              ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
            }
          } else {
            ret = ">=" + M + "." + m + "." + p + " <" + (+M + 1) + ".0.0";
          }
        }
        debug("caret return", ret);
        return ret;
      });
    }
    function replaceXRanges(comp, options) {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map(function(comp2) {
        return replaceXRange(comp2, options);
      }).join(" ");
    }
    function replaceXRange(comp, options) {
      comp = comp.trim();
      var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        var xM = isX(M);
        var xm = xM || isX(m);
        var xp = xm || isX(p);
        var anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          ret = gtlt + M + "." + m + "." + p + pr;
        } else if (xm) {
          ret = ">=" + M + ".0.0" + pr + " <" + (+M + 1) + ".0.0" + pr;
        } else if (xp) {
          ret = ">=" + M + "." + m + ".0" + pr + " <" + M + "." + (+m + 1) + ".0" + pr;
        }
        debug("xRange return", ret);
        return ret;
      });
    }
    function replaceStars(comp, options) {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    }
    function hyphenReplace($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = ">=" + fM + ".0.0";
      } else if (isX(fp)) {
        from = ">=" + fM + "." + fm + ".0";
      } else {
        from = ">=" + from;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = "<" + (+tM + 1) + ".0.0";
      } else if (isX(tp)) {
        to = "<" + tM + "." + (+tm + 1) + ".0";
      } else if (tpr) {
        to = "<=" + tM + "." + tm + "." + tp + "-" + tpr;
      } else {
        to = "<=" + to;
      }
      return (from + " " + to).trim();
    }
    Range.prototype.test = function(version) {
      if (!version) {
        return false;
      }
      if (typeof version === "string") {
        try {
          version = new SemVer(version, this.options);
        } catch (er) {
          return false;
        }
      }
      for (var i2 = 0; i2 < this.set.length; i2++) {
        if (testSet(this.set[i2], version, this.options)) {
          return true;
        }
      }
      return false;
    };
    function testSet(set, version, options) {
      for (var i2 = 0; i2 < set.length; i2++) {
        if (!set[i2].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (i2 = 0; i2 < set.length; i2++) {
          debug(set[i2].semver);
          if (set[i2].semver === ANY) {
            continue;
          }
          if (set[i2].semver.prerelease.length > 0) {
            var allowed = set[i2].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    }
    exports.satisfies = satisfies;
    function satisfies(version, range, options) {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    }
    exports.maxSatisfying = maxSatisfying;
    function maxSatisfying(versions, range, options) {
      var max = null;
      var maxSV = null;
      try {
        var rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach(function(v) {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    }
    exports.minSatisfying = minSatisfying;
    function minSatisfying(versions, range, options) {
      var min = null;
      var minSV = null;
      try {
        var rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach(function(v) {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    }
    exports.minVersion = minVersion;
    function minVersion(range, loose) {
      range = new Range(range, loose);
      var minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (var i2 = 0; i2 < range.set.length; ++i2) {
        var comparators = range.set[i2];
        comparators.forEach(function(comparator) {
          var compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            case "":
            case ">=":
              if (!minver || gt(minver, compver)) {
                minver = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            default:
              throw new Error("Unexpected operation: " + comparator.operator);
          }
        });
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    }
    exports.validRange = validRange;
    function validRange(range, options) {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    }
    exports.ltr = ltr;
    function ltr(version, range, options) {
      return outside(version, range, "<", options);
    }
    exports.gtr = gtr;
    function gtr(version, range, options) {
      return outside(version, range, ">", options);
    }
    exports.outside = outside;
    function outside(version, range, hilo, options) {
      version = new SemVer(version, options);
      range = new Range(range, options);
      var gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version, range, options)) {
        return false;
      }
      for (var i2 = 0; i2 < range.set.length; ++i2) {
        var comparators = range.set[i2];
        var high = null;
        var low = null;
        comparators.forEach(function(comparator) {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    }
    exports.prerelease = prerelease;
    function prerelease(version, options) {
      var parsed = parse(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    }
    exports.intersects = intersects;
    function intersects(r1, r2, options) {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2);
    }
    exports.coerce = coerce;
    function coerce(version, options) {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === "number") {
        version = String(version);
      }
      if (typeof version !== "string") {
        return null;
      }
      options = options || {};
      var match = null;
      if (!options.rtl) {
        match = version.match(re[t.COERCE]);
      } else {
        var next;
        while ((next = re[t.COERCERTL].exec(version)) && (!match || match.index + match[0].length !== version.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
        }
        re[t.COERCERTL].lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      return parse(match[2] + "." + (match[3] || "0") + "." + (match[4] || "0"), options);
    }
  }
});

// packages/run-script/scripts/prepareRelease.ts
var prepareRelease_exports = {};
__export(prepareRelease_exports, {
  default: () => prepareRelease_default
});
import * as fs2 from "fs";
function prepareRelease_default(context3) {
  return __async(this, null, function* () {
    context3.version.new = (context3.env.VERSION_STRING || "%s").replace(
      "%s",
      require_semver().inc(context3.version.old, context3.branch.level)
    );
    const packageJson = JSON.parse(fs2.readFileSync("package.json", "utf-8"));
    if (packageJson.workspaces != null) {
      yield (0, import_lerna.version)(context3, {});
    } else {
      yield (0, import_npm.version)(context3, {});
    }
    yield import_git2.utils.gitAdd(...context3.changedFiles);
    yield import_git2.utils.gitCommit(`Bump version to ${context3.version.new}`);
    yield import_git2.utils.gitPush(context3, context3.branch.name);
  });
}
var import_git2, import_lerna, import_npm;
var init_prepareRelease = __esm({
  "packages/run-script/scripts/prepareRelease.ts"() {
    "use strict";
    import_git2 = __toESM(require_lib3());
    import_lerna = __toESM(require_lib4());
    import_npm = __toESM(require_lib2());
  }
});

// node_modules/traverse/index.js
var require_traverse = __commonJS({
  "node_modules/traverse/index.js"(exports, module) {
    module.exports = Traverse;
    function Traverse(obj) {
      if (!(this instanceof Traverse))
        return new Traverse(obj);
      this.value = obj;
    }
    Traverse.prototype.get = function(ps) {
      var node = this.value;
      for (var i = 0; i < ps.length; i++) {
        var key = ps[i];
        if (!Object.hasOwnProperty.call(node, key)) {
          node = void 0;
          break;
        }
        node = node[key];
      }
      return node;
    };
    Traverse.prototype.set = function(ps, value) {
      var node = this.value;
      for (var i = 0; i < ps.length - 1; i++) {
        var key = ps[i];
        if (!Object.hasOwnProperty.call(node, key))
          node[key] = {};
        node = node[key];
      }
      node[ps[i]] = value;
      return value;
    };
    Traverse.prototype.map = function(cb) {
      return walk(this.value, cb, true);
    };
    Traverse.prototype.forEach = function(cb) {
      this.value = walk(this.value, cb, false);
      return this.value;
    };
    Traverse.prototype.reduce = function(cb, init) {
      var skip = arguments.length === 1;
      var acc = skip ? this.value : init;
      this.forEach(function(x) {
        if (!this.isRoot || !skip) {
          acc = cb.call(this, acc, x);
        }
      });
      return acc;
    };
    Traverse.prototype.deepEqual = function(obj) {
      if (arguments.length !== 1) {
        throw new Error(
          "deepEqual requires exactly one object to compare against"
        );
      }
      var equal = true;
      var node = obj;
      this.forEach(function(y) {
        var notEqual = function() {
          equal = false;
          return void 0;
        }.bind(this);
        if (!this.isRoot) {
          if (typeof node !== "object")
            return notEqual();
          node = node[this.key];
        }
        var x = node;
        this.post(function() {
          node = x;
        });
        var toS = function(o) {
          return Object.prototype.toString.call(o);
        };
        if (this.circular) {
          if (Traverse(obj).get(this.circular.path) !== x)
            notEqual();
        } else if (typeof x !== typeof y) {
          notEqual();
        } else if (x === null || y === null || x === void 0 || y === void 0) {
          if (x !== y)
            notEqual();
        } else if (x.__proto__ !== y.__proto__) {
          notEqual();
        } else if (x === y) {
        } else if (typeof x === "function") {
          if (x instanceof RegExp) {
            if (x.toString() != y.toString())
              notEqual();
          } else if (x !== y)
            notEqual();
        } else if (typeof x === "object") {
          if (toS(y) === "[object Arguments]" || toS(x) === "[object Arguments]") {
            if (toS(x) !== toS(y)) {
              notEqual();
            }
          } else if (x instanceof Date || y instanceof Date) {
            if (!(x instanceof Date) || !(y instanceof Date) || x.getTime() !== y.getTime()) {
              notEqual();
            }
          } else {
            var kx = Object.keys(x);
            var ky = Object.keys(y);
            if (kx.length !== ky.length)
              return notEqual();
            for (var i = 0; i < kx.length; i++) {
              var k = kx[i];
              if (!Object.hasOwnProperty.call(y, k)) {
                notEqual();
              }
            }
          }
        }
      });
      return equal;
    };
    Traverse.prototype.paths = function() {
      var acc = [];
      this.forEach(function(x) {
        acc.push(this.path);
      });
      return acc;
    };
    Traverse.prototype.nodes = function() {
      var acc = [];
      this.forEach(function(x) {
        acc.push(this.node);
      });
      return acc;
    };
    Traverse.prototype.clone = function() {
      var parents = [], nodes = [];
      return function clone(src) {
        for (var i = 0; i < parents.length; i++) {
          if (parents[i] === src) {
            return nodes[i];
          }
        }
        if (typeof src === "object" && src !== null) {
          var dst = copy(src);
          parents.push(src);
          nodes.push(dst);
          Object.keys(src).forEach(function(key) {
            dst[key] = clone(src[key]);
          });
          parents.pop();
          nodes.pop();
          return dst;
        } else {
          return src;
        }
      }(this.value);
    };
    function walk(root, cb, immutable) {
      var path2 = [];
      var parents = [];
      var alive = true;
      return function walker(node_) {
        var node = immutable ? copy(node_) : node_;
        var modifiers = {};
        var state = {
          node,
          node_,
          path: [].concat(path2),
          parent: parents.slice(-1)[0],
          key: path2.slice(-1)[0],
          isRoot: path2.length === 0,
          level: path2.length,
          circular: null,
          update: function(x) {
            if (!state.isRoot) {
              state.parent.node[state.key] = x;
            }
            state.node = x;
          },
          "delete": function() {
            delete state.parent.node[state.key];
          },
          remove: function() {
            if (Array.isArray(state.parent.node)) {
              state.parent.node.splice(state.key, 1);
            } else {
              delete state.parent.node[state.key];
            }
          },
          before: function(f) {
            modifiers.before = f;
          },
          after: function(f) {
            modifiers.after = f;
          },
          pre: function(f) {
            modifiers.pre = f;
          },
          post: function(f) {
            modifiers.post = f;
          },
          stop: function() {
            alive = false;
          }
        };
        if (!alive)
          return state;
        if (typeof node === "object" && node !== null) {
          state.isLeaf = Object.keys(node).length == 0;
          for (var i = 0; i < parents.length; i++) {
            if (parents[i].node_ === node_) {
              state.circular = parents[i];
              break;
            }
          }
        } else {
          state.isLeaf = true;
        }
        state.notLeaf = !state.isLeaf;
        state.notRoot = !state.isRoot;
        var ret = cb.call(state, state.node);
        if (ret !== void 0 && state.update)
          state.update(ret);
        if (modifiers.before)
          modifiers.before.call(state, state.node);
        if (typeof state.node == "object" && state.node !== null && !state.circular) {
          parents.push(state);
          var keys = Object.keys(state.node);
          keys.forEach(function(key, i2) {
            path2.push(key);
            if (modifiers.pre)
              modifiers.pre.call(state, state.node[key], key);
            var child = walker(state.node[key]);
            if (immutable && Object.hasOwnProperty.call(state.node, key)) {
              state.node[key] = child.node;
            }
            child.isLast = i2 == keys.length - 1;
            child.isFirst = i2 == 0;
            if (modifiers.post)
              modifiers.post.call(state, child);
            path2.pop();
          });
          parents.pop();
        }
        if (modifiers.after)
          modifiers.after.call(state, state.node);
        return state;
      }(root).node;
    }
    Object.keys(Traverse.prototype).forEach(function(key) {
      Traverse[key] = function(obj) {
        var args = [].slice.call(arguments, 1);
        var t = Traverse(obj);
        return t[key].apply(t, args);
      };
    });
    function copy(src) {
      if (typeof src === "object" && src !== null) {
        var dst;
        if (Array.isArray(src)) {
          dst = [];
        } else if (src instanceof Date) {
          dst = new Date(src);
        } else if (src instanceof Boolean) {
          dst = new Boolean(src);
        } else if (src instanceof Number) {
          dst = new Number(src);
        } else if (src instanceof String) {
          dst = new String(src);
        } else {
          dst = Object.create(Object.getPrototypeOf(src));
        }
        Object.keys(src).forEach(function(key) {
          dst[key] = src[key];
        });
        return dst;
      } else
        return src;
    }
  }
});

// node_modules/chainsaw/index.js
var require_chainsaw = __commonJS({
  "node_modules/chainsaw/index.js"(exports, module) {
    var Traverse = require_traverse();
    var EventEmitter = __require("events").EventEmitter;
    module.exports = Chainsaw;
    function Chainsaw(builder) {
      var saw = Chainsaw.saw(builder, {});
      var r = builder.call(saw.handlers, saw);
      if (r !== void 0)
        saw.handlers = r;
      saw.record();
      return saw.chain();
    }
    Chainsaw.light = function ChainsawLight(builder) {
      var saw = Chainsaw.saw(builder, {});
      var r = builder.call(saw.handlers, saw);
      if (r !== void 0)
        saw.handlers = r;
      return saw.chain();
    };
    Chainsaw.saw = function(builder, handlers) {
      var saw = new EventEmitter();
      saw.handlers = handlers;
      saw.actions = [];
      saw.chain = function() {
        var ch = Traverse(saw.handlers).map(function(node) {
          if (this.isRoot)
            return node;
          var ps = this.path;
          if (typeof node === "function") {
            this.update(function() {
              saw.actions.push({
                path: ps,
                args: [].slice.call(arguments)
              });
              return ch;
            });
          }
        });
        process.nextTick(function() {
          saw.emit("begin");
          saw.next();
        });
        return ch;
      };
      saw.pop = function() {
        return saw.actions.shift();
      };
      saw.next = function() {
        var action = saw.pop();
        if (!action) {
          saw.emit("end");
        } else if (!action.trap) {
          var node = saw.handlers;
          action.path.forEach(function(key) {
            node = node[key];
          });
          node.apply(saw.handlers, action.args);
        }
      };
      saw.nest = function(cb) {
        var args = [].slice.call(arguments, 1);
        var autonext = true;
        if (typeof cb === "boolean") {
          var autonext = cb;
          cb = args.shift();
        }
        var s = Chainsaw.saw(builder, {});
        var r = builder.call(s.handlers, s);
        if (r !== void 0)
          s.handlers = r;
        if ("undefined" !== typeof saw.step) {
          s.record();
        }
        cb.apply(s.chain(), args);
        if (autonext !== false)
          s.on("end", saw.next);
      };
      saw.record = function() {
        upgradeChainsaw(saw);
      };
      ["trap", "down", "jump"].forEach(function(method) {
        saw[method] = function() {
          throw new Error("To use the trap, down and jump features, please call record() first to start recording actions.");
        };
      });
      return saw;
    };
    function upgradeChainsaw(saw) {
      saw.step = 0;
      saw.pop = function() {
        return saw.actions[saw.step++];
      };
      saw.trap = function(name, cb) {
        var ps = Array.isArray(name) ? name : [name];
        saw.actions.push({
          path: ps,
          step: saw.step,
          cb,
          trap: true
        });
      };
      saw.down = function(name) {
        var ps = (Array.isArray(name) ? name : [name]).join("/");
        var i = saw.actions.slice(saw.step).map(function(x) {
          if (x.trap && x.step <= saw.step)
            return false;
          return x.path.join("/") == ps;
        }).indexOf(true);
        if (i >= 0)
          saw.step += i;
        else
          saw.step = saw.actions.length;
        var act = saw.actions[saw.step - 1];
        if (act && act.trap) {
          saw.step = act.step;
          act.cb();
        } else
          saw.next();
      };
      saw.jump = function(step) {
        saw.step = step;
        saw.next();
      };
    }
  }
});

// node_modules/buffers/index.js
var require_buffers = __commonJS({
  "node_modules/buffers/index.js"(exports, module) {
    module.exports = Buffers;
    function Buffers(bufs) {
      if (!(this instanceof Buffers))
        return new Buffers(bufs);
      this.buffers = bufs || [];
      this.length = this.buffers.reduce(function(size, buf) {
        return size + buf.length;
      }, 0);
    }
    Buffers.prototype.push = function() {
      for (var i = 0; i < arguments.length; i++) {
        if (!Buffer.isBuffer(arguments[i])) {
          throw new TypeError("Tried to push a non-buffer");
        }
      }
      for (var i = 0; i < arguments.length; i++) {
        var buf = arguments[i];
        this.buffers.push(buf);
        this.length += buf.length;
      }
      return this.length;
    };
    Buffers.prototype.unshift = function() {
      for (var i = 0; i < arguments.length; i++) {
        if (!Buffer.isBuffer(arguments[i])) {
          throw new TypeError("Tried to unshift a non-buffer");
        }
      }
      for (var i = 0; i < arguments.length; i++) {
        var buf = arguments[i];
        this.buffers.unshift(buf);
        this.length += buf.length;
      }
      return this.length;
    };
    Buffers.prototype.copy = function(dst, dStart, start, end) {
      return this.slice(start, end).copy(dst, dStart, 0, end - start);
    };
    Buffers.prototype.splice = function(i, howMany) {
      var buffers = this.buffers;
      var index = i >= 0 ? i : this.length - i;
      var reps = [].slice.call(arguments, 2);
      if (howMany === void 0) {
        howMany = this.length - index;
      } else if (howMany > this.length - index) {
        howMany = this.length - index;
      }
      for (var i = 0; i < reps.length; i++) {
        this.length += reps[i].length;
      }
      var removed = new Buffers();
      var bytes = 0;
      var startBytes = 0;
      for (var ii = 0; ii < buffers.length && startBytes + buffers[ii].length < index; ii++) {
        startBytes += buffers[ii].length;
      }
      if (index - startBytes > 0) {
        var start = index - startBytes;
        if (start + howMany < buffers[ii].length) {
          removed.push(buffers[ii].slice(start, start + howMany));
          var orig = buffers[ii];
          var buf0 = new Buffer(start);
          for (var i = 0; i < start; i++) {
            buf0[i] = orig[i];
          }
          var buf1 = new Buffer(orig.length - start - howMany);
          for (var i = start + howMany; i < orig.length; i++) {
            buf1[i - howMany - start] = orig[i];
          }
          if (reps.length > 0) {
            var reps_ = reps.slice();
            reps_.unshift(buf0);
            reps_.push(buf1);
            buffers.splice.apply(buffers, [ii, 1].concat(reps_));
            ii += reps_.length;
            reps = [];
          } else {
            buffers.splice(ii, 1, buf0, buf1);
            ii += 2;
          }
        } else {
          removed.push(buffers[ii].slice(start));
          buffers[ii] = buffers[ii].slice(0, start);
          ii++;
        }
      }
      if (reps.length > 0) {
        buffers.splice.apply(buffers, [ii, 0].concat(reps));
        ii += reps.length;
      }
      while (removed.length < howMany) {
        var buf = buffers[ii];
        var len = buf.length;
        var take = Math.min(len, howMany - removed.length);
        if (take === len) {
          removed.push(buf);
          buffers.splice(ii, 1);
        } else {
          removed.push(buf.slice(0, take));
          buffers[ii] = buffers[ii].slice(take);
        }
      }
      this.length -= removed.length;
      return removed;
    };
    Buffers.prototype.slice = function(i, j) {
      var buffers = this.buffers;
      if (j === void 0)
        j = this.length;
      if (i === void 0)
        i = 0;
      if (j > this.length)
        j = this.length;
      var startBytes = 0;
      for (var si = 0; si < buffers.length && startBytes + buffers[si].length <= i; si++) {
        startBytes += buffers[si].length;
      }
      var target = new Buffer(j - i);
      var ti = 0;
      for (var ii = si; ti < j - i && ii < buffers.length; ii++) {
        var len = buffers[ii].length;
        var start = ti === 0 ? i - startBytes : 0;
        var end = ti + len >= j - i ? Math.min(start + (j - i) - ti, len) : len;
        buffers[ii].copy(target, ti, start, end);
        ti += end - start;
      }
      return target;
    };
    Buffers.prototype.pos = function(i) {
      if (i < 0 || i >= this.length)
        throw new Error("oob");
      var l = i, bi = 0, bu = null;
      for (; ; ) {
        bu = this.buffers[bi];
        if (l < bu.length) {
          return { buf: bi, offset: l };
        } else {
          l -= bu.length;
        }
        bi++;
      }
    };
    Buffers.prototype.get = function get(i) {
      var pos = this.pos(i);
      return this.buffers[pos.buf].get(pos.offset);
    };
    Buffers.prototype.set = function set(i, b) {
      var pos = this.pos(i);
      return this.buffers[pos.buf].set(pos.offset, b);
    };
    Buffers.prototype.indexOf = function(needle, offset) {
      if ("string" === typeof needle) {
        needle = new Buffer(needle);
      } else if (needle instanceof Buffer) {
      } else {
        throw new Error("Invalid type for a search string");
      }
      if (!needle.length) {
        return 0;
      }
      if (!this.length) {
        return -1;
      }
      var i = 0, j = 0, match = 0, mstart, pos = 0;
      if (offset) {
        var p = this.pos(offset);
        i = p.buf;
        j = p.offset;
        pos = offset;
      }
      for (; ; ) {
        while (j >= this.buffers[i].length) {
          j = 0;
          i++;
          if (i >= this.buffers.length) {
            return -1;
          }
        }
        var char = this.buffers[i][j];
        if (char == needle[match]) {
          if (match == 0) {
            mstart = {
              i,
              j,
              pos
            };
          }
          match++;
          if (match == needle.length) {
            return mstart.pos;
          }
        } else if (match != 0) {
          i = mstart.i;
          j = mstart.j;
          pos = mstart.pos;
          match = 0;
        }
        j++;
        pos++;
      }
    };
    Buffers.prototype.toBuffer = function() {
      return this.slice();
    };
    Buffers.prototype.toString = function(encoding, start, end) {
      return this.slice(start, end).toString(encoding);
    };
  }
});

// node_modules/binary/lib/vars.js
var require_vars = __commonJS({
  "node_modules/binary/lib/vars.js"(exports, module) {
    module.exports = function(store) {
      function getset(name, value) {
        var node = vars.store;
        var keys = name.split(".");
        keys.slice(0, -1).forEach(function(k) {
          if (node[k] === void 0)
            node[k] = {};
          node = node[k];
        });
        var key = keys[keys.length - 1];
        if (arguments.length == 1) {
          return node[key];
        } else {
          return node[key] = value;
        }
      }
      var vars = {
        get: function(name) {
          return getset(name);
        },
        set: function(name, value) {
          return getset(name, value);
        },
        store: store || {}
      };
      return vars;
    };
  }
});

// node_modules/binary/index.js
var require_binary = __commonJS({
  "node_modules/binary/index.js"(exports, module) {
    var Chainsaw = require_chainsaw();
    var EventEmitter = __require("events").EventEmitter;
    var Buffers = require_buffers();
    var Vars = require_vars();
    var Stream = __require("stream").Stream;
    exports = module.exports = function(bufOrEm, eventName) {
      if (Buffer.isBuffer(bufOrEm)) {
        return exports.parse(bufOrEm);
      }
      var s = exports.stream();
      if (bufOrEm && bufOrEm.pipe) {
        bufOrEm.pipe(s);
      } else if (bufOrEm) {
        bufOrEm.on(eventName || "data", function(buf) {
          s.write(buf);
        });
        bufOrEm.on("end", function() {
          s.end();
        });
      }
      return s;
    };
    exports.stream = function(input) {
      if (input)
        return exports.apply(null, arguments);
      var pending = null;
      function getBytes(bytes, cb, skip) {
        pending = {
          bytes,
          skip,
          cb: function(buf) {
            pending = null;
            cb(buf);
          }
        };
        dispatch();
      }
      var offset = null;
      function dispatch() {
        if (!pending) {
          if (caughtEnd)
            done = true;
          return;
        }
        if (typeof pending === "function") {
          pending();
        } else {
          var bytes = offset + pending.bytes;
          if (buffers.length >= bytes) {
            var buf;
            if (offset == null) {
              buf = buffers.splice(0, bytes);
              if (!pending.skip) {
                buf = buf.slice();
              }
            } else {
              if (!pending.skip) {
                buf = buffers.slice(offset, bytes);
              }
              offset = bytes;
            }
            if (pending.skip) {
              pending.cb();
            } else {
              pending.cb(buf);
            }
          }
        }
      }
      function builder(saw) {
        function next() {
          if (!done)
            saw.next();
        }
        var self = words(function(bytes, cb) {
          return function(name) {
            getBytes(bytes, function(buf) {
              vars.set(name, cb(buf));
              next();
            });
          };
        });
        self.tap = function(cb) {
          saw.nest(cb, vars.store);
        };
        self.into = function(key, cb) {
          if (!vars.get(key))
            vars.set(key, {});
          var parent = vars;
          vars = Vars(parent.get(key));
          saw.nest(function() {
            cb.apply(this, arguments);
            this.tap(function() {
              vars = parent;
            });
          }, vars.store);
        };
        self.flush = function() {
          vars.store = {};
          next();
        };
        self.loop = function(cb) {
          var end = false;
          saw.nest(false, function loop() {
            this.vars = vars.store;
            cb.call(this, function() {
              end = true;
              next();
            }, vars.store);
            this.tap(function() {
              if (end)
                saw.next();
              else
                loop.call(this);
            }.bind(this));
          }, vars.store);
        };
        self.buffer = function(name, bytes) {
          if (typeof bytes === "string") {
            bytes = vars.get(bytes);
          }
          getBytes(bytes, function(buf) {
            vars.set(name, buf);
            next();
          });
        };
        self.skip = function(bytes) {
          if (typeof bytes === "string") {
            bytes = vars.get(bytes);
          }
          getBytes(bytes, function() {
            next();
          });
        };
        self.scan = function find(name, search) {
          if (typeof search === "string") {
            search = new Buffer(search);
          } else if (!Buffer.isBuffer(search)) {
            throw new Error("search must be a Buffer or a string");
          }
          var taken = 0;
          pending = function() {
            var pos = buffers.indexOf(search, offset + taken);
            var i = pos - offset - taken;
            if (pos !== -1) {
              pending = null;
              if (offset != null) {
                vars.set(
                  name,
                  buffers.slice(offset, offset + taken + i)
                );
                offset += taken + i + search.length;
              } else {
                vars.set(
                  name,
                  buffers.slice(0, taken + i)
                );
                buffers.splice(0, taken + i + search.length);
              }
              next();
              dispatch();
            } else {
              i = Math.max(buffers.length - search.length - offset - taken, 0);
            }
            taken += i;
          };
          dispatch();
        };
        self.peek = function(cb) {
          offset = 0;
          saw.nest(function() {
            cb.call(this, vars.store);
            this.tap(function() {
              offset = null;
            });
          });
        };
        return self;
      }
      ;
      var stream = Chainsaw.light(builder);
      stream.writable = true;
      var buffers = Buffers();
      stream.write = function(buf) {
        buffers.push(buf);
        dispatch();
      };
      var vars = Vars();
      var done = false, caughtEnd = false;
      stream.end = function() {
        caughtEnd = true;
      };
      stream.pipe = Stream.prototype.pipe;
      Object.getOwnPropertyNames(EventEmitter.prototype).forEach(function(name) {
        stream[name] = EventEmitter.prototype[name];
      });
      return stream;
    };
    exports.parse = function parse(buffer) {
      var self = words(function(bytes, cb) {
        return function(name) {
          if (offset + bytes <= buffer.length) {
            var buf = buffer.slice(offset, offset + bytes);
            offset += bytes;
            vars.set(name, cb(buf));
          } else {
            vars.set(name, null);
          }
          return self;
        };
      });
      var offset = 0;
      var vars = Vars();
      self.vars = vars.store;
      self.tap = function(cb) {
        cb.call(self, vars.store);
        return self;
      };
      self.into = function(key, cb) {
        if (!vars.get(key)) {
          vars.set(key, {});
        }
        var parent = vars;
        vars = Vars(parent.get(key));
        cb.call(self, vars.store);
        vars = parent;
        return self;
      };
      self.loop = function(cb) {
        var end = false;
        var ender = function() {
          end = true;
        };
        while (end === false) {
          cb.call(self, ender, vars.store);
        }
        return self;
      };
      self.buffer = function(name, size) {
        if (typeof size === "string") {
          size = vars.get(size);
        }
        var buf = buffer.slice(offset, Math.min(buffer.length, offset + size));
        offset += size;
        vars.set(name, buf);
        return self;
      };
      self.skip = function(bytes) {
        if (typeof bytes === "string") {
          bytes = vars.get(bytes);
        }
        offset += bytes;
        return self;
      };
      self.scan = function(name, search) {
        if (typeof search === "string") {
          search = new Buffer(search);
        } else if (!Buffer.isBuffer(search)) {
          throw new Error("search must be a Buffer or a string");
        }
        vars.set(name, null);
        for (var i = 0; i + offset <= buffer.length - search.length + 1; i++) {
          for (var j = 0; j < search.length && buffer[offset + i + j] === search[j]; j++)
            ;
          if (j === search.length)
            break;
        }
        vars.set(name, buffer.slice(offset, offset + i));
        offset += i + search.length;
        return self;
      };
      self.peek = function(cb) {
        var was = offset;
        cb.call(self, vars.store);
        offset = was;
        return self;
      };
      self.flush = function() {
        vars.store = {};
        return self;
      };
      self.eof = function() {
        return offset >= buffer.length;
      };
      return self;
    };
    function decodeLEu(bytes) {
      var acc = 0;
      for (var i = 0; i < bytes.length; i++) {
        acc += Math.pow(256, i) * bytes[i];
      }
      return acc;
    }
    function decodeBEu(bytes) {
      var acc = 0;
      for (var i = 0; i < bytes.length; i++) {
        acc += Math.pow(256, bytes.length - i - 1) * bytes[i];
      }
      return acc;
    }
    function decodeBEs(bytes) {
      var val = decodeBEu(bytes);
      if ((bytes[0] & 128) == 128) {
        val -= Math.pow(256, bytes.length);
      }
      return val;
    }
    function decodeLEs(bytes) {
      var val = decodeLEu(bytes);
      if ((bytes[bytes.length - 1] & 128) == 128) {
        val -= Math.pow(256, bytes.length);
      }
      return val;
    }
    function words(decode) {
      var self = {};
      [1, 2, 4, 8].forEach(function(bytes) {
        var bits = bytes * 8;
        self["word" + bits + "le"] = self["word" + bits + "lu"] = decode(bytes, decodeLEu);
        self["word" + bits + "ls"] = decode(bytes, decodeLEs);
        self["word" + bits + "be"] = self["word" + bits + "bu"] = decode(bytes, decodeBEu);
        self["word" + bits + "bs"] = decode(bytes, decodeBEs);
      });
      self.word8 = self.word8u = self.word8be;
      self.word8s = self.word8bs;
      return self;
    }
  }
});

// node_modules/unzip-stream/lib/matcher-stream.js
var require_matcher_stream = __commonJS({
  "node_modules/unzip-stream/lib/matcher-stream.js"(exports, module) {
    var Transform = __require("stream").Transform;
    var util = __require("util");
    function MatcherStream(patternDesc, matchFn) {
      if (!(this instanceof MatcherStream)) {
        return new MatcherStream();
      }
      Transform.call(this);
      var p = typeof patternDesc === "object" ? patternDesc.pattern : patternDesc;
      this.pattern = Buffer.isBuffer(p) ? p : Buffer.from(p);
      this.requiredLength = this.pattern.length;
      if (patternDesc.requiredExtraSize)
        this.requiredLength += patternDesc.requiredExtraSize;
      this.data = new Buffer("");
      this.bytesSoFar = 0;
      this.matchFn = matchFn;
    }
    util.inherits(MatcherStream, Transform);
    MatcherStream.prototype.checkDataChunk = function(ignoreMatchZero) {
      var enoughData = this.data.length >= this.requiredLength;
      if (!enoughData) {
        return;
      }
      var matchIndex = this.data.indexOf(this.pattern, ignoreMatchZero ? 1 : 0);
      if (matchIndex >= 0 && matchIndex + this.requiredLength > this.data.length) {
        if (matchIndex > 0) {
          var packet = this.data.slice(0, matchIndex);
          this.push(packet);
          this.bytesSoFar += matchIndex;
          this.data = this.data.slice(matchIndex);
        }
        return;
      }
      if (matchIndex === -1) {
        var packetLen = this.data.length - this.requiredLength + 1;
        var packet = this.data.slice(0, packetLen);
        this.push(packet);
        this.bytesSoFar += packetLen;
        this.data = this.data.slice(packetLen);
        return;
      }
      if (matchIndex > 0) {
        var packet = this.data.slice(0, matchIndex);
        this.data = this.data.slice(matchIndex);
        this.push(packet);
        this.bytesSoFar += matchIndex;
      }
      var finished = this.matchFn ? this.matchFn(this.data, this.bytesSoFar) : true;
      if (finished) {
        this.data = new Buffer("");
        return;
      }
      return true;
    };
    MatcherStream.prototype._transform = function(chunk, encoding, cb) {
      this.data = Buffer.concat([this.data, chunk]);
      var firstIteration = true;
      while (this.checkDataChunk(!firstIteration)) {
        firstIteration = false;
      }
      cb();
    };
    MatcherStream.prototype._flush = function(cb) {
      if (this.data.length > 0) {
        var firstIteration = true;
        while (this.checkDataChunk(!firstIteration)) {
          firstIteration = false;
        }
      }
      if (this.data.length > 0) {
        this.push(this.data);
        this.data = null;
      }
      cb();
    };
    module.exports = MatcherStream;
  }
});

// node_modules/unzip-stream/lib/entry.js
var require_entry = __commonJS({
  "node_modules/unzip-stream/lib/entry.js"(exports, module) {
    "use strict";
    var stream = __require("stream");
    var inherits = __require("util").inherits;
    function Entry() {
      if (!(this instanceof Entry)) {
        return new Entry();
      }
      stream.PassThrough.call(this);
      this.path = null;
      this.type = null;
      this.isDirectory = false;
    }
    inherits(Entry, stream.PassThrough);
    Entry.prototype.autodrain = function() {
      return this.pipe(new stream.Transform({ transform: function(d, e, cb) {
        cb();
      } }));
    };
    module.exports = Entry;
  }
});

// node_modules/unzip-stream/lib/unzip-stream.js
var require_unzip_stream = __commonJS({
  "node_modules/unzip-stream/lib/unzip-stream.js"(exports, module) {
    "use strict";
    var binary = require_binary();
    var stream = __require("stream");
    var util = __require("util");
    var zlib = __require("zlib");
    var MatcherStream = require_matcher_stream();
    var Entry = require_entry();
    var states = {
      STREAM_START: 0,
      START: 1,
      LOCAL_FILE_HEADER: 2,
      LOCAL_FILE_HEADER_SUFFIX: 3,
      FILE_DATA: 4,
      FILE_DATA_END: 5,
      DATA_DESCRIPTOR: 6,
      CENTRAL_DIRECTORY_FILE_HEADER: 7,
      CENTRAL_DIRECTORY_FILE_HEADER_SUFFIX: 8,
      CDIR64_END: 9,
      CDIR64_END_DATA_SECTOR: 10,
      CDIR64_LOCATOR: 11,
      CENTRAL_DIRECTORY_END: 12,
      CENTRAL_DIRECTORY_END_COMMENT: 13,
      TRAILING_JUNK: 14,
      ERROR: 99
    };
    var FOUR_GIGS = 4294967296;
    var SIG_LOCAL_FILE_HEADER = 67324752;
    var SIG_DATA_DESCRIPTOR = 134695760;
    var SIG_CDIR_RECORD = 33639248;
    var SIG_CDIR64_RECORD_END = 101075792;
    var SIG_CDIR64_LOCATOR_END = 117853008;
    var SIG_CDIR_RECORD_END = 101010256;
    function UnzipStream(options) {
      if (!(this instanceof UnzipStream)) {
        return new UnzipStream(options);
      }
      stream.Transform.call(this);
      this.options = options || {};
      this.data = new Buffer("");
      this.state = states.STREAM_START;
      this.skippedBytes = 0;
      this.parsedEntity = null;
      this.outStreamInfo = {};
    }
    util.inherits(UnzipStream, stream.Transform);
    UnzipStream.prototype.processDataChunk = function(chunk) {
      var requiredLength;
      switch (this.state) {
        case states.STREAM_START:
        case states.START:
          requiredLength = 4;
          break;
        case states.LOCAL_FILE_HEADER:
          requiredLength = 26;
          break;
        case states.LOCAL_FILE_HEADER_SUFFIX:
          requiredLength = this.parsedEntity.fileNameLength + this.parsedEntity.extraFieldLength;
          break;
        case states.DATA_DESCRIPTOR:
          requiredLength = 12;
          break;
        case states.CENTRAL_DIRECTORY_FILE_HEADER:
          requiredLength = 42;
          break;
        case states.CENTRAL_DIRECTORY_FILE_HEADER_SUFFIX:
          requiredLength = this.parsedEntity.fileNameLength + this.parsedEntity.extraFieldLength + this.parsedEntity.fileCommentLength;
          break;
        case states.CDIR64_END:
          requiredLength = 52;
          break;
        case states.CDIR64_END_DATA_SECTOR:
          requiredLength = this.parsedEntity.centralDirectoryRecordSize - 44;
          break;
        case states.CDIR64_LOCATOR:
          requiredLength = 16;
          break;
        case states.CENTRAL_DIRECTORY_END:
          requiredLength = 18;
          break;
        case states.CENTRAL_DIRECTORY_END_COMMENT:
          requiredLength = this.parsedEntity.commentLength;
          break;
        case states.FILE_DATA:
          return 0;
        case states.FILE_DATA_END:
          return 0;
        case states.TRAILING_JUNK:
          if (this.options.debug)
            console.log("found", chunk.length, "bytes of TRAILING_JUNK");
          return chunk.length;
        default:
          return chunk.length;
      }
      var chunkLength = chunk.length;
      if (chunkLength < requiredLength) {
        return 0;
      }
      switch (this.state) {
        case states.STREAM_START:
        case states.START:
          var signature = chunk.readUInt32LE(0);
          switch (signature) {
            case SIG_LOCAL_FILE_HEADER:
              this.state = states.LOCAL_FILE_HEADER;
              break;
            case SIG_CDIR_RECORD:
              this.state = states.CENTRAL_DIRECTORY_FILE_HEADER;
              break;
            case SIG_CDIR64_RECORD_END:
              this.state = states.CDIR64_END;
              break;
            case SIG_CDIR64_LOCATOR_END:
              this.state = states.CDIR64_LOCATOR;
              break;
            case SIG_CDIR_RECORD_END:
              this.state = states.CENTRAL_DIRECTORY_END;
              break;
            default:
              var isStreamStart = this.state === states.STREAM_START;
              if (!isStreamStart && (signature & 65535) !== 19280 && this.skippedBytes < 26) {
                var remaining = signature;
                var toSkip = 4;
                for (var i = 1; i < 4 && remaining !== 0; i++) {
                  remaining = remaining >>> 8;
                  if ((remaining & 255) === 80) {
                    toSkip = i;
                    break;
                  }
                }
                this.skippedBytes += toSkip;
                if (this.options.debug)
                  console.log("Skipped", this.skippedBytes, "bytes");
                return toSkip;
              }
              this.state = states.ERROR;
              var errMsg = isStreamStart ? "Not a valid zip file" : "Invalid signature in zip file";
              if (this.options.debug) {
                var sig = chunk.readUInt32LE(0);
                var asString;
                try {
                  asString = chunk.slice(0, 4).toString();
                } catch (e) {
                }
                console.log("Unexpected signature in zip file: 0x" + sig.toString(16), '"' + asString + '", skipped', this.skippedBytes, "bytes");
              }
              this.emit("error", new Error(errMsg));
              return chunk.length;
          }
          this.skippedBytes = 0;
          return requiredLength;
        case states.LOCAL_FILE_HEADER:
          this.parsedEntity = this._readFile(chunk);
          this.state = states.LOCAL_FILE_HEADER_SUFFIX;
          return requiredLength;
        case states.LOCAL_FILE_HEADER_SUFFIX:
          var entry = new Entry();
          var isUtf8 = (this.parsedEntity.flags & 2048) !== 0;
          entry.path = this._decodeString(chunk.slice(0, this.parsedEntity.fileNameLength), isUtf8);
          var extraDataBuffer = chunk.slice(this.parsedEntity.fileNameLength, this.parsedEntity.fileNameLength + this.parsedEntity.extraFieldLength);
          var extra = this._readExtraFields(extraDataBuffer);
          if (extra && extra.parsed) {
            if (extra.parsed.path && !isUtf8) {
              entry.path = extra.parsed.path;
            }
            if (Number.isFinite(extra.parsed.uncompressedSize) && this.parsedEntity.uncompressedSize === FOUR_GIGS - 1) {
              this.parsedEntity.uncompressedSize = extra.parsed.uncompressedSize;
            }
            if (Number.isFinite(extra.parsed.compressedSize) && this.parsedEntity.compressedSize === FOUR_GIGS - 1) {
              this.parsedEntity.compressedSize = extra.parsed.compressedSize;
            }
          }
          this.parsedEntity.extra = extra.parsed || {};
          if (this.options.debug) {
            const debugObj = Object.assign({}, this.parsedEntity, {
              path: entry.path,
              flags: "0x" + this.parsedEntity.flags.toString(16),
              extraFields: extra && extra.debug
            });
            console.log("decoded LOCAL_FILE_HEADER:", JSON.stringify(debugObj, null, 2));
          }
          this._prepareOutStream(this.parsedEntity, entry);
          this.emit("entry", entry);
          this.state = states.FILE_DATA;
          return requiredLength;
        case states.CENTRAL_DIRECTORY_FILE_HEADER:
          this.parsedEntity = this._readCentralDirectoryEntry(chunk);
          this.state = states.CENTRAL_DIRECTORY_FILE_HEADER_SUFFIX;
          return requiredLength;
        case states.CENTRAL_DIRECTORY_FILE_HEADER_SUFFIX:
          var isUtf8 = (this.parsedEntity.flags & 2048) !== 0;
          var path2 = this._decodeString(chunk.slice(0, this.parsedEntity.fileNameLength), isUtf8);
          var extraDataBuffer = chunk.slice(this.parsedEntity.fileNameLength, this.parsedEntity.fileNameLength + this.parsedEntity.extraFieldLength);
          var extra = this._readExtraFields(extraDataBuffer);
          if (extra && extra.parsed && extra.parsed.path && !isUtf8) {
            path2 = extra.parsed.path;
          }
          this.parsedEntity.extra = extra.parsed;
          var isUnix = (this.parsedEntity.versionMadeBy & 65280) >> 8 === 3;
          var unixAttrs, isSymlink;
          if (isUnix) {
            unixAttrs = this.parsedEntity.externalFileAttributes >>> 16;
            var fileType = unixAttrs >>> 12;
            isSymlink = (fileType & 10) === 10;
          }
          if (this.options.debug) {
            const debugObj = Object.assign({}, this.parsedEntity, {
              path: path2,
              flags: "0x" + this.parsedEntity.flags.toString(16),
              unixAttrs: unixAttrs && "0" + unixAttrs.toString(8),
              isSymlink,
              extraFields: extra.debug
            });
            console.log("decoded CENTRAL_DIRECTORY_FILE_HEADER:", JSON.stringify(debugObj, null, 2));
          }
          this.state = states.START;
          return requiredLength;
        case states.CDIR64_END:
          this.parsedEntity = this._readEndOfCentralDirectory64(chunk);
          if (this.options.debug) {
            console.log("decoded CDIR64_END_RECORD:", this.parsedEntity);
          }
          this.state = states.CDIR64_END_DATA_SECTOR;
          return requiredLength;
        case states.CDIR64_END_DATA_SECTOR:
          this.state = states.START;
          return requiredLength;
        case states.CDIR64_LOCATOR:
          this.state = states.START;
          return requiredLength;
        case states.CENTRAL_DIRECTORY_END:
          this.parsedEntity = this._readEndOfCentralDirectory(chunk);
          if (this.options.debug) {
            console.log("decoded CENTRAL_DIRECTORY_END:", this.parsedEntity);
          }
          this.state = states.CENTRAL_DIRECTORY_END_COMMENT;
          return requiredLength;
        case states.CENTRAL_DIRECTORY_END_COMMENT:
          if (this.options.debug) {
            console.log("decoded CENTRAL_DIRECTORY_END_COMMENT:", chunk.slice(0, requiredLength).toString());
          }
          this.state = states.TRAILING_JUNK;
          return requiredLength;
        case states.ERROR:
          return chunk.length;
        default:
          console.log("didn't handle state #", this.state, "discarding");
          return chunk.length;
      }
    };
    UnzipStream.prototype._prepareOutStream = function(vars, entry) {
      var self = this;
      var isDirectory = vars.uncompressedSize === 0 && /[\/\\]$/.test(entry.path);
      entry.path = entry.path.replace(/^([/\\]*[.]+[/\\]+)*[/\\]*/, "");
      entry.type = isDirectory ? "Directory" : "File";
      entry.isDirectory = isDirectory;
      var fileSizeKnown = !(vars.flags & 8);
      if (fileSizeKnown) {
        entry.size = vars.uncompressedSize;
      }
      var isVersionSupported = vars.versionsNeededToExtract <= 45;
      this.outStreamInfo = {
        stream: null,
        limit: fileSizeKnown ? vars.compressedSize : -1,
        written: 0
      };
      if (!fileSizeKnown) {
        var pattern = new Buffer(4);
        pattern.writeUInt32LE(SIG_DATA_DESCRIPTOR, 0);
        var zip64Mode = vars.extra.zip64Mode;
        var extraSize = zip64Mode ? 20 : 12;
        var searchPattern = {
          pattern,
          requiredExtraSize: extraSize
        };
        var matcherStream = new MatcherStream(searchPattern, function(matchedChunk, sizeSoFar) {
          var vars2 = self._readDataDescriptor(matchedChunk, zip64Mode);
          var compressedSizeMatches = vars2.compressedSize === sizeSoFar;
          if (!zip64Mode && !compressedSizeMatches && sizeSoFar >= FOUR_GIGS) {
            var overflown = sizeSoFar - FOUR_GIGS;
            while (overflown >= 0) {
              compressedSizeMatches = vars2.compressedSize === overflown;
              if (compressedSizeMatches)
                break;
              overflown -= FOUR_GIGS;
            }
          }
          if (!compressedSizeMatches) {
            return;
          }
          self.state = states.FILE_DATA_END;
          var sliceOffset = zip64Mode ? 24 : 16;
          if (self.data.length > 0) {
            self.data = Buffer.concat([matchedChunk.slice(sliceOffset), self.data]);
          } else {
            self.data = matchedChunk.slice(sliceOffset);
          }
          return true;
        });
        this.outStreamInfo.stream = matcherStream;
      } else {
        this.outStreamInfo.stream = new stream.PassThrough();
      }
      var isEncrypted = vars.flags & 1 || vars.flags & 64;
      if (isEncrypted || !isVersionSupported) {
        var message = isEncrypted ? "Encrypted files are not supported!" : "Zip version " + Math.floor(vars.versionsNeededToExtract / 10) + "." + vars.versionsNeededToExtract % 10 + " is not supported";
        entry.skip = true;
        setImmediate(() => {
          entry.emit("error", new Error(message));
        });
        this.outStreamInfo.stream.pipe(new Entry().autodrain());
        return;
      }
      var isCompressed = vars.compressionMethod > 0;
      if (isCompressed) {
        var inflater = zlib.createInflateRaw();
        inflater.on("error", function(err) {
          self.state = states.ERROR;
          self.emit("error", err);
        });
        this.outStreamInfo.stream.pipe(inflater).pipe(entry);
      } else {
        this.outStreamInfo.stream.pipe(entry);
      }
      if (this._drainAllEntries) {
        entry.autodrain();
      }
    };
    UnzipStream.prototype._readFile = function(data) {
      var vars = binary.parse(data).word16lu("versionsNeededToExtract").word16lu("flags").word16lu("compressionMethod").word16lu("lastModifiedTime").word16lu("lastModifiedDate").word32lu("crc32").word32lu("compressedSize").word32lu("uncompressedSize").word16lu("fileNameLength").word16lu("extraFieldLength").vars;
      return vars;
    };
    UnzipStream.prototype._readExtraFields = function(data) {
      var extra = {};
      var result = { parsed: extra };
      if (this.options.debug) {
        result.debug = [];
      }
      var index = 0;
      while (index < data.length) {
        var vars = binary.parse(data).skip(index).word16lu("extraId").word16lu("extraSize").vars;
        index += 4;
        var fieldType = void 0;
        switch (vars.extraId) {
          case 1:
            fieldType = "Zip64 extended information extra field";
            var z64vars = binary.parse(data.slice(index, index + vars.extraSize)).word64lu("uncompressedSize").word64lu("compressedSize").word64lu("offsetToLocalHeader").word32lu("diskStartNumber").vars;
            if (z64vars.uncompressedSize !== null) {
              extra.uncompressedSize = z64vars.uncompressedSize;
            }
            if (z64vars.compressedSize !== null) {
              extra.compressedSize = z64vars.compressedSize;
            }
            extra.zip64Mode = true;
            break;
          case 10:
            fieldType = "NTFS extra field";
            break;
          case 21589:
            fieldType = "extended timestamp";
            var timestampFields = data.readUInt8(index);
            var offset = 1;
            if (vars.extraSize >= offset + 4 && timestampFields & 1) {
              extra.mtime = new Date(data.readUInt32LE(index + offset) * 1e3);
              offset += 4;
            }
            if (vars.extraSize >= offset + 4 && timestampFields & 2) {
              extra.atime = new Date(data.readUInt32LE(index + offset) * 1e3);
              offset += 4;
            }
            if (vars.extraSize >= offset + 4 && timestampFields & 4) {
              extra.ctime = new Date(data.readUInt32LE(index + offset) * 1e3);
            }
            break;
          case 28789:
            fieldType = "Info-ZIP Unicode Path Extra Field";
            var fieldVer = data.readUInt8(index);
            if (fieldVer === 1) {
              var offset = 1;
              var nameCrc32 = data.readUInt32LE(index + offset);
              offset += 4;
              var pathBuffer = data.slice(index + offset);
              extra.path = pathBuffer.toString();
            }
            break;
          case 13:
          case 22613:
            fieldType = vars.extraId === 13 ? "PKWARE Unix" : "Info-ZIP UNIX (type 1)";
            var offset = 0;
            if (vars.extraSize >= 8) {
              var atime = new Date(data.readUInt32LE(index + offset) * 1e3);
              offset += 4;
              var mtime = new Date(data.readUInt32LE(index + offset) * 1e3);
              offset += 4;
              extra.atime = atime;
              extra.mtime = mtime;
              if (vars.extraSize >= 12) {
                var uid = data.readUInt16LE(index + offset);
                offset += 2;
                var gid = data.readUInt16LE(index + offset);
                offset += 2;
                extra.uid = uid;
                extra.gid = gid;
              }
            }
            break;
          case 30805:
            fieldType = "Info-ZIP UNIX (type 2)";
            var offset = 0;
            if (vars.extraSize >= 4) {
              var uid = data.readUInt16LE(index + offset);
              offset += 2;
              var gid = data.readUInt16LE(index + offset);
              offset += 2;
              extra.uid = uid;
              extra.gid = gid;
            }
            break;
          case 30837:
            fieldType = "Info-ZIP New Unix";
            var offset = 0;
            var extraVer = data.readUInt8(index);
            offset += 1;
            if (extraVer === 1) {
              var uidSize = data.readUInt8(index + offset);
              offset += 1;
              if (uidSize <= 6) {
                extra.uid = data.readUIntLE(index + offset, uidSize);
              }
              offset += uidSize;
              var gidSize = data.readUInt8(index + offset);
              offset += 1;
              if (gidSize <= 6) {
                extra.gid = data.readUIntLE(index + offset, gidSize);
              }
            }
            break;
          case 30062:
            fieldType = "ASi Unix";
            var offset = 0;
            if (vars.extraSize >= 14) {
              var crc = data.readUInt32LE(index + offset);
              offset += 4;
              var mode = data.readUInt16LE(index + offset);
              offset += 2;
              var sizdev = data.readUInt32LE(index + offset);
              offset += 4;
              var uid = data.readUInt16LE(index + offset);
              offset += 2;
              var gid = data.readUInt16LE(index + offset);
              offset += 2;
              extra.mode = mode;
              extra.uid = uid;
              extra.gid = gid;
              if (vars.extraSize > 14) {
                var start = index + offset;
                var end = index + vars.extraSize - 14;
                var symlinkName = this._decodeString(data.slice(start, end));
                extra.symlink = symlinkName;
              }
            }
            break;
        }
        if (this.options.debug) {
          result.debug.push({
            extraId: "0x" + vars.extraId.toString(16),
            description: fieldType,
            data: data.slice(index, index + vars.extraSize).inspect()
          });
        }
        index += vars.extraSize;
      }
      return result;
    };
    UnzipStream.prototype._readDataDescriptor = function(data, zip64Mode) {
      if (zip64Mode) {
        var vars = binary.parse(data).word32lu("dataDescriptorSignature").word32lu("crc32").word64lu("compressedSize").word64lu("uncompressedSize").vars;
        return vars;
      }
      var vars = binary.parse(data).word32lu("dataDescriptorSignature").word32lu("crc32").word32lu("compressedSize").word32lu("uncompressedSize").vars;
      return vars;
    };
    UnzipStream.prototype._readCentralDirectoryEntry = function(data) {
      var vars = binary.parse(data).word16lu("versionMadeBy").word16lu("versionsNeededToExtract").word16lu("flags").word16lu("compressionMethod").word16lu("lastModifiedTime").word16lu("lastModifiedDate").word32lu("crc32").word32lu("compressedSize").word32lu("uncompressedSize").word16lu("fileNameLength").word16lu("extraFieldLength").word16lu("fileCommentLength").word16lu("diskNumber").word16lu("internalFileAttributes").word32lu("externalFileAttributes").word32lu("offsetToLocalFileHeader").vars;
      return vars;
    };
    UnzipStream.prototype._readEndOfCentralDirectory64 = function(data) {
      var vars = binary.parse(data).word64lu("centralDirectoryRecordSize").word16lu("versionMadeBy").word16lu("versionsNeededToExtract").word32lu("diskNumber").word32lu("diskNumberWithCentralDirectoryStart").word64lu("centralDirectoryEntries").word64lu("totalCentralDirectoryEntries").word64lu("sizeOfCentralDirectory").word64lu("offsetToStartOfCentralDirectory").vars;
      return vars;
    };
    UnzipStream.prototype._readEndOfCentralDirectory = function(data) {
      var vars = binary.parse(data).word16lu("diskNumber").word16lu("diskStart").word16lu("centralDirectoryEntries").word16lu("totalCentralDirectoryEntries").word32lu("sizeOfCentralDirectory").word32lu("offsetToStartOfCentralDirectory").word16lu("commentLength").vars;
      return vars;
    };
    var cp437 = "\0\u263A\u263B\u2665\u2666\u2663\u2660\u2022\u25D8\u25CB\u25D9\u2642\u2640\u266A\u266B\u263C\u25BA\u25C4\u2195\u203C\xB6\xA7\u25AC\u21A8\u2191\u2193\u2192\u2190\u221F\u2194\u25B2\u25BC !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u2302\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xA2\xA3\xA5\u20A7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0 ";
    UnzipStream.prototype._decodeString = function(buffer, isUtf8) {
      if (isUtf8) {
        return buffer.toString("utf8");
      }
      if (this.options.decodeString) {
        return this.options.decodeString(buffer);
      }
      let result = "";
      for (var i = 0; i < buffer.length; i++) {
        result += cp437[buffer[i]];
      }
      return result;
    };
    UnzipStream.prototype._parseOrOutput = function(encoding, cb) {
      var consume;
      while ((consume = this.processDataChunk(this.data)) > 0) {
        this.data = this.data.slice(consume);
        if (this.data.length === 0)
          break;
      }
      if (this.state === states.FILE_DATA) {
        if (this.outStreamInfo.limit >= 0) {
          var remaining = this.outStreamInfo.limit - this.outStreamInfo.written;
          var packet;
          if (remaining < this.data.length) {
            packet = this.data.slice(0, remaining);
            this.data = this.data.slice(remaining);
          } else {
            packet = this.data;
            this.data = new Buffer("");
          }
          this.outStreamInfo.written += packet.length;
          if (this.outStreamInfo.limit === this.outStreamInfo.written) {
            this.state = states.START;
            this.outStreamInfo.stream.end(packet, encoding, cb);
          } else {
            this.outStreamInfo.stream.write(packet, encoding, cb);
          }
        } else {
          var packet = this.data;
          this.data = new Buffer("");
          this.outStreamInfo.written += packet.length;
          var outputStream = this.outStreamInfo.stream;
          outputStream.write(packet, encoding, () => {
            if (this.state === states.FILE_DATA_END) {
              this.state = states.START;
              return outputStream.end(cb);
            }
            cb();
          });
        }
        return;
      }
      cb();
    };
    UnzipStream.prototype.drainAll = function() {
      this._drainAllEntries = true;
    };
    UnzipStream.prototype._transform = function(chunk, encoding, cb) {
      var self = this;
      if (self.data.length > 0) {
        self.data = Buffer.concat([self.data, chunk]);
      } else {
        self.data = chunk;
      }
      var startDataLength = self.data.length;
      var done = function() {
        if (self.data.length > 0 && self.data.length < startDataLength) {
          startDataLength = self.data.length;
          self._parseOrOutput(encoding, done);
          return;
        }
        cb();
      };
      self._parseOrOutput(encoding, done);
    };
    UnzipStream.prototype._flush = function(cb) {
      var self = this;
      if (self.data.length > 0) {
        self._parseOrOutput("buffer", function() {
          if (self.data.length > 0)
            return setImmediate(function() {
              self._flush(cb);
            });
          cb();
        });
        return;
      }
      if (self.state === states.FILE_DATA) {
        return cb(new Error("Stream finished in an invalid state, uncompression failed"));
      }
      setImmediate(cb);
    };
    module.exports = UnzipStream;
  }
});

// node_modules/unzip-stream/lib/parser-stream.js
var require_parser_stream = __commonJS({
  "node_modules/unzip-stream/lib/parser-stream.js"(exports, module) {
    var Transform = __require("stream").Transform;
    var util = __require("util");
    var UnzipStream = require_unzip_stream();
    function ParserStream(opts) {
      if (!(this instanceof ParserStream)) {
        return new ParserStream(opts);
      }
      var transformOpts = opts || {};
      Transform.call(this, { readableObjectMode: true });
      this.opts = opts || {};
      this.unzipStream = new UnzipStream(this.opts);
      var self = this;
      this.unzipStream.on("entry", function(entry) {
        self.push(entry);
      });
      this.unzipStream.on("error", function(error2) {
        self.emit("error", error2);
      });
    }
    util.inherits(ParserStream, Transform);
    ParserStream.prototype._transform = function(chunk, encoding, cb) {
      this.unzipStream.write(chunk, encoding, cb);
    };
    ParserStream.prototype._flush = function(cb) {
      var self = this;
      this.unzipStream.end(function() {
        process.nextTick(function() {
          self.emit("close");
        });
        cb();
      });
    };
    ParserStream.prototype.on = function(eventName, fn) {
      if (eventName === "entry") {
        return Transform.prototype.on.call(this, "data", fn);
      }
      return Transform.prototype.on.call(this, eventName, fn);
    };
    ParserStream.prototype.drainAll = function() {
      this.unzipStream.drainAll();
      return this.pipe(new Transform({ objectMode: true, transform: function(d, e, cb) {
        cb();
      } }));
    };
    module.exports = ParserStream;
  }
});

// node_modules/mkdirp/index.js
var require_mkdirp = __commonJS({
  "node_modules/mkdirp/index.js"(exports, module) {
    var path2 = __require("path");
    var fs5 = __require("fs");
    var _0777 = parseInt("0777", 8);
    module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;
    function mkdirP(p, opts, f, made) {
      if (typeof opts === "function") {
        f = opts;
        opts = {};
      } else if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      var mode = opts.mode;
      var xfs = opts.fs || fs5;
      if (mode === void 0) {
        mode = _0777;
      }
      if (!made)
        made = null;
      var cb = f || /* istanbul ignore next */
      function() {
      };
      p = path2.resolve(p);
      xfs.mkdir(p, mode, function(er) {
        if (!er) {
          made = made || p;
          return cb(null, made);
        }
        switch (er.code) {
          case "ENOENT":
            if (path2.dirname(p) === p)
              return cb(er);
            mkdirP(path2.dirname(p), opts, function(er2, made2) {
              if (er2)
                cb(er2, made2);
              else
                mkdirP(p, opts, cb, made2);
            });
            break;
          default:
            xfs.stat(p, function(er2, stat) {
              if (er2 || !stat.isDirectory())
                cb(er, made);
              else
                cb(null, made);
            });
            break;
        }
      });
    }
    mkdirP.sync = function sync(p, opts, made) {
      if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      var mode = opts.mode;
      var xfs = opts.fs || fs5;
      if (mode === void 0) {
        mode = _0777;
      }
      if (!made)
        made = null;
      p = path2.resolve(p);
      try {
        xfs.mkdirSync(p, mode);
        made = made || p;
      } catch (err0) {
        switch (err0.code) {
          case "ENOENT":
            made = sync(path2.dirname(p), opts, made);
            sync(p, opts, made);
            break;
          default:
            var stat;
            try {
              stat = xfs.statSync(p);
            } catch (err1) {
              throw err0;
            }
            if (!stat.isDirectory())
              throw err0;
            break;
        }
      }
      return made;
    };
  }
});

// node_modules/unzip-stream/lib/extract.js
var require_extract = __commonJS({
  "node_modules/unzip-stream/lib/extract.js"(exports, module) {
    var fs5 = __require("fs");
    var path2 = __require("path");
    var util = __require("util");
    var mkdirp = require_mkdirp();
    var Transform = __require("stream").Transform;
    var UnzipStream = require_unzip_stream();
    function Extract(opts) {
      if (!(this instanceof Extract))
        return new Extract(opts);
      Transform.call(this);
      this.opts = opts || {};
      this.unzipStream = new UnzipStream(this.opts);
      this.unfinishedEntries = 0;
      this.afterFlushWait = false;
      this.createdDirectories = {};
      var self = this;
      this.unzipStream.on("entry", this._processEntry.bind(this));
      this.unzipStream.on("error", function(error2) {
        self.emit("error", error2);
      });
    }
    util.inherits(Extract, Transform);
    Extract.prototype._transform = function(chunk, encoding, cb) {
      this.unzipStream.write(chunk, encoding, cb);
    };
    Extract.prototype._flush = function(cb) {
      var self = this;
      var allDone = function() {
        process.nextTick(function() {
          self.emit("close");
        });
        cb();
      };
      this.unzipStream.end(function() {
        if (self.unfinishedEntries > 0) {
          self.afterFlushWait = true;
          return self.on("await-finished", allDone);
        }
        allDone();
      });
    };
    Extract.prototype._processEntry = function(entry) {
      var self = this;
      var destPath = path2.join(this.opts.path, entry.path);
      var directory = entry.isDirectory ? destPath : path2.dirname(destPath);
      this.unfinishedEntries++;
      var writeFileFn = function() {
        var pipedStream = fs5.createWriteStream(destPath);
        pipedStream.on("close", function() {
          self.unfinishedEntries--;
          self._notifyAwaiter();
        });
        pipedStream.on("error", function(error2) {
          self.emit("error", error2);
        });
        entry.pipe(pipedStream);
      };
      if (this.createdDirectories[directory] || directory === ".") {
        return writeFileFn();
      }
      mkdirp(directory, function(err) {
        if (err)
          return self.emit("error", err);
        self.createdDirectories[directory] = true;
        if (entry.isDirectory) {
          self.unfinishedEntries--;
          self._notifyAwaiter();
          return;
        }
        writeFileFn();
      });
    };
    Extract.prototype._notifyAwaiter = function() {
      if (this.afterFlushWait && this.unfinishedEntries === 0) {
        this.emit("await-finished");
        this.afterFlushWait = false;
      }
    };
    module.exports = Extract;
  }
});

// node_modules/unzip-stream/unzip.js
var require_unzip = __commonJS({
  "node_modules/unzip-stream/unzip.js"(exports) {
    "use strict";
    exports.Parse = require_parser_stream();
    exports.Extract = require_extract();
  }
});

// packages/run-script/src/utils.ts
import * as fs3 from "fs";
import { pipeline, Readable } from "stream";
import { promisify } from "util";
function downloadArtifact(runId, artifactName, extractPath) {
  return __async(this, null, function* () {
    const octokit = github.getOctokit(core2.getInput("github-token") || process.env.GITHUB_TOKEN);
    const artifactInfo = (yield octokit.rest.actions.listWorkflowRunArtifacts(__spreadProps(__spreadValues({}, github.context.repo), {
      run_id: runId
    }))).data.artifacts.find((a) => a.name === artifactName);
    if (artifactInfo == null) {
      throw new Error(`Could not find artifact ${artifactName} for run ID ${runId}`);
    }
    const artifactRaw = Buffer.from((yield octokit.rest.actions.downloadArtifact(__spreadProps(__spreadValues({}, github.context.repo), {
      artifact_id: artifactInfo.id,
      archive_format: "zip"
    }))).data);
    if (extractPath != null) {
      fs3.mkdirSync(extractPath, { recursive: true });
    }
    yield promisify(pipeline)(
      Readable.from(artifactRaw),
      require_unzip().Extract({ path: extractPath != null ? extractPath : process.cwd() })
    );
  });
}
function findCurrentPr(state = "open") {
  return __async(this, null, function* () {
    const octokit = github.getOctokit(core2.getInput("github-token") || process.env.GITHUB_TOKEN);
    if (github.context.payload.workflow_run == null) {
      const prs = (yield octokit.rest.repos.listPullRequestsAssociatedWithCommit(__spreadProps(__spreadValues({}, github.context.repo), {
        commit_sha: github.context.sha
      }))).data.filter((pr) => !state || pr.state === state);
      return prs.find((pr) => github.context.payload.ref === `refs/heads/${pr.head.ref}`) || prs[0];
    } else {
      const [owner, repo] = github.context.payload.workflow_run.head_repository.full_name.split("/", 2);
      const prs = (yield octokit.rest.repos.listPullRequestsAssociatedWithCommit({
        owner,
        repo,
        commit_sha: github.context.payload.workflow_run.head_sha
      })).data.filter((pr) => (!state || pr.state === state) && pr.base.repo.full_name === github.context.payload.workflow_run.repository.full_name);
      return prs.find((pr) => pr.head.ref === github.context.payload.workflow_run.head_branch) || prs[0];
    }
  });
}
var core2, github;
var init_utils = __esm({
  "packages/run-script/src/utils.ts"() {
    "use strict";
    core2 = __toESM(require_core());
    github = __toESM(require_github());
  }
});

// packages/run-script/scripts/sonarConfig.ts
var sonarConfig_exports = {};
__export(sonarConfig_exports, {
  default: () => sonarConfig_default
});
import * as fs4 from "fs";
function downloadCoverageReports(context3) {
  return __async(this, null, function* () {
    if (context3.ci.service !== "github" || process.env.COVERAGE_ARTIFACT == null) {
      return;
    }
    const [artifactName, extractPath] = process.env.COVERAGE_ARTIFACT.split(":", 2);
    yield downloadArtifact(github2.context.payload.workflow_run.id, artifactName, extractPath);
  });
}
function getPrHeadRef(pr) {
  if (pr.base.repo.full_name === pr.head.repo.full_name) {
    return pr.head.ref;
  } else {
    return `${pr.head.repo.full_name.split("/")[0]}:${pr.head.ref}`;
  }
}
function rewriteCoverageReports(context3) {
  if (context3.ci.service !== "github") {
    return;
  }
  const sonarProps = properties.of("sonar-project.properties");
  const reportPaths = sonarProps.get("sonar.javascript.lcov.reportPaths");
  if (typeof reportPaths !== "string") {
    return;
  }
  context3.logger.info("Fixing coverage paths for SonarCloud");
  const pattern = new RegExp(context3.env.GITHUB_WORKSPACE, "g");
  for (const reportPath of reportPaths.split(",")) {
    const reportText = fs4.readFileSync(reportPath, "utf-8");
    fs4.writeFileSync(reportPath, reportText.replace(pattern, "/github/workspace"));
  }
}
function sonarConfig_default(context3) {
  return __async(this, null, function* () {
    var _a, _b;
    const sonarProps = {};
    const packageJson = JSON.parse(fs4.readFileSync(fs4.existsSync("lerna.json") ? "lerna.json" : "package.json", "utf-8"));
    sonarProps["sonar.projectVersion"] = packageJson.version;
    sonarProps["sonar.links.ci"] = `https://github.com/${context3.ci.slug}/actions/runs/${context3.ci.build}`;
    if (github2.context.payload.workflow_run != null) {
      sonarProps["sonar.scm.revision"] = github2.context.payload.workflow_run.head_sha;
    }
    const pr = yield findCurrentPr();
    if (pr != null) {
      sonarProps["sonar.pullrequest.key"] = pr.number;
      sonarProps["sonar.pullrequest.branch"] = getPrHeadRef(pr);
      sonarProps["sonar.pullrequest.base"] = pr.base.ref;
    } else {
      sonarProps["sonar.branch.name"] = (_b = (_a = github2.context.payload.workflow_run) == null ? void 0 : _a.head_branch) != null ? _b : context3.ci.branch;
    }
    context3.logger.info("Sonar scan properties:\n" + JSON.stringify(sonarProps, null, 2));
    fs4.appendFileSync("sonar-project.properties", Object.entries(sonarProps).map(([k, v]) => `${k}=${v}`).join("\n"));
    yield downloadCoverageReports(context3);
    rewriteCoverageReports(context3);
  });
}
var github2, properties;
var init_sonarConfig = __esm({
  "packages/run-script/scripts/sonarConfig.ts"() {
    "use strict";
    github2 = __toESM(require_github());
    properties = __toESM(require_dist_node());
    init_utils();
  }
});

// packages/run-script/src/index.ts
var core3 = __toESM(require_core());
var import_core = __toESM(require_lib());
import * as path from "path";

// packages/run-script/src/loader.ts
var SCRIPTS = {
  npmUpdate: (init_npmUpdate(), __toCommonJS(npmUpdate_exports)),
  prepareRelease: (init_prepareRelease(), __toCommonJS(prepareRelease_exports)),
  sonarConfig: (init_sonarConfig(), __toCommonJS(sonarConfig_exports))
};
var RELEASE_SCRIPTS = ["npmUpdate"];
function loadScript(scriptName) {
  if (!Object.keys(SCRIPTS).includes(scriptName)) {
    throw new Error(`Could not find script to run: ${scriptName}`);
  }
  return SCRIPTS[scriptName].default;
}

// packages/run-script/src/index.ts
init_utils();
function run() {
  return __async(this, null, function* () {
    var _a;
    try {
      const workingDir = core3.getInput("working-dir");
      if (workingDir) {
        process.chdir(path.resolve(workingDir));
      }
      const prBranch = (_a = yield findCurrentPr()) == null ? void 0 : _a.base.ref;
      const context3 = yield import_core.utils.buildContext({
        branch: prBranch,
        force: !RELEASE_SCRIPTS.includes(core3.getInput("script"))
      });
      if (context3 == null) {
        core3.info("Current branch is not targeting a release branch, exiting now");
        process.exit();
      }
      yield loadScript(core3.getInput("script"))(context3);
    } catch (error2) {
      if (error2 instanceof Error) {
        core3.error(error2.stack || error2.message);
      }
      core3.setFailed(error2);
    }
  });
}
run();
