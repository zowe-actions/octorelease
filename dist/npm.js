var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/delay/index.js
var require_delay = __commonJS({
  "../../node_modules/delay/index.js"(exports, module) {
    "use strict";
    var randomInteger = (minimum, maximum) => Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
    var createAbortError = () => {
      const error = new Error("Delay aborted");
      error.name = "AbortError";
      return error;
    };
    var createDelay = ({ clearTimeout: defaultClear, setTimeout: set, willResolve }) => (ms, { value, signal } = {}) => {
      if (signal && signal.aborted) {
        return Promise.reject(createAbortError());
      }
      let timeoutId;
      let settle;
      let rejectFn;
      const clear = defaultClear || clearTimeout;
      const signalListener = () => {
        clear(timeoutId);
        rejectFn(createAbortError());
      };
      const cleanup = () => {
        if (signal) {
          signal.removeEventListener("abort", signalListener);
        }
      };
      const delayPromise = new Promise((resolve3, reject) => {
        settle = () => {
          cleanup();
          if (willResolve) {
            resolve3(value);
          } else {
            reject(value);
          }
        };
        rejectFn = reject;
        timeoutId = (set || setTimeout)(settle, ms);
      });
      if (signal) {
        signal.addEventListener("abort", signalListener, { once: true });
      }
      delayPromise.clear = () => {
        clear(timeoutId);
        timeoutId = null;
        settle();
      };
      return delayPromise;
    };
    var createWithTimers = (clearAndSet) => {
      const delay3 = createDelay({ ...clearAndSet, willResolve: true });
      delay3.reject = createDelay({ ...clearAndSet, willResolve: false });
      delay3.range = (minimum, maximum, options) => delay3(randomInteger(minimum, maximum), options);
      return delay3;
    };
    var delay2 = createWithTimers();
    delay2.createWithTimers = createWithTimers;
    module.exports = delay2;
    module.exports.default = delay2;
  }
});

// ../../node_modules/yocto-queue/index.js
var require_yocto_queue = __commonJS({
  "../../node_modules/yocto-queue/index.js"(exports, module) {
    var Node = class {
      /// value;
      /// next;
      constructor(value) {
        this.value = value;
        this.next = void 0;
      }
    };
    var Queue = class {
      // TODO: Use private class fields when targeting Node.js 12.
      // #_head;
      // #_tail;
      // #_size;
      constructor() {
        this.clear();
      }
      enqueue(value) {
        const node = new Node(value);
        if (this._head) {
          this._tail.next = node;
          this._tail = node;
        } else {
          this._head = node;
          this._tail = node;
        }
        this._size++;
      }
      dequeue() {
        const current = this._head;
        if (!current) {
          return;
        }
        this._head = this._head.next;
        this._size--;
        return current.value;
      }
      clear() {
        this._head = void 0;
        this._tail = void 0;
        this._size = 0;
      }
      get size() {
        return this._size;
      }
      *[Symbol.iterator]() {
        let current = this._head;
        while (current) {
          yield current.value;
          current = current.next;
        }
      }
    };
    module.exports = Queue;
  }
});

// ../../node_modules/p-limit/index.js
var require_p_limit = __commonJS({
  "../../node_modules/p-limit/index.js"(exports, module) {
    "use strict";
    var Queue = require_yocto_queue();
    var pLimit = (concurrency) => {
      if (!((Number.isInteger(concurrency) || concurrency === Infinity) && concurrency > 0)) {
        throw new TypeError("Expected `concurrency` to be a number from 1 and up");
      }
      const queue = new Queue();
      let activeCount = 0;
      const next = () => {
        activeCount--;
        if (queue.size > 0) {
          queue.dequeue()();
        }
      };
      const run = async (fn, resolve3, ...args) => {
        activeCount++;
        const result = (async () => fn(...args))();
        resolve3(result);
        try {
          await result;
        } catch {
        }
        next();
      };
      const enqueue = (fn, resolve3, ...args) => {
        queue.enqueue(run.bind(null, fn, resolve3, ...args));
        (async () => {
          await Promise.resolve();
          if (activeCount < concurrency && queue.size > 0) {
            queue.dequeue()();
          }
        })();
      };
      const generator = (fn, ...args) => new Promise((resolve3) => {
        enqueue(fn, resolve3, ...args);
      });
      Object.defineProperties(generator, {
        activeCount: {
          get: () => activeCount
        },
        pendingCount: {
          get: () => queue.size
        },
        clearQueue: {
          value: () => {
            queue.clear();
          }
        }
      });
      return generator;
    };
    module.exports = pLimit;
  }
});

// ../../node_modules/p-locate/index.js
var require_p_locate = __commonJS({
  "../../node_modules/p-locate/index.js"(exports, module) {
    "use strict";
    var pLimit = require_p_limit();
    var EndError = class extends Error {
      constructor(value) {
        super();
        this.value = value;
      }
    };
    var testElement = async (element, tester) => tester(await element);
    var finder = async (element) => {
      const values = await Promise.all(element);
      if (values[1] === true) {
        throw new EndError(values[0]);
      }
      return false;
    };
    var pLocate = async (iterable, tester, options) => {
      options = {
        concurrency: Infinity,
        preserveOrder: true,
        ...options
      };
      const limit = pLimit(options.concurrency);
      const items = [...iterable].map((element) => [element, limit(testElement, element, tester)]);
      const checkLimit = pLimit(options.preserveOrder ? 1 : Infinity);
      try {
        await Promise.all(items.map((element) => checkLimit(finder, element)));
      } catch (error) {
        if (error instanceof EndError) {
          return error.value;
        }
        throw error;
      }
    };
    module.exports = pLocate;
  }
});

// ../../node_modules/locate-path/index.js
var require_locate_path = __commonJS({
  "../../node_modules/locate-path/index.js"(exports, module) {
    "use strict";
    var path8 = __require("path");
    var fs6 = __require("fs");
    var { promisify } = __require("util");
    var pLocate = require_p_locate();
    var fsStat = promisify(fs6.stat);
    var fsLStat = promisify(fs6.lstat);
    var typeMappings = {
      directory: "isDirectory",
      file: "isFile"
    };
    function checkType({ type }) {
      if (type in typeMappings) {
        return;
      }
      throw new Error(`Invalid type specified: ${type}`);
    }
    var matchType = (type, stat2) => type === void 0 || stat2[typeMappings[type]]();
    module.exports = async (paths, options) => {
      options = {
        cwd: process.cwd(),
        type: "file",
        allowSymlinks: true,
        ...options
      };
      checkType(options);
      const statFn = options.allowSymlinks ? fsStat : fsLStat;
      return pLocate(paths, async (path_) => {
        try {
          const stat2 = await statFn(path8.resolve(options.cwd, path_));
          return matchType(options.type, stat2);
        } catch {
          return false;
        }
      }, options);
    };
    module.exports.sync = (paths, options) => {
      options = {
        cwd: process.cwd(),
        allowSymlinks: true,
        type: "file",
        ...options
      };
      checkType(options);
      const statFn = options.allowSymlinks ? fs6.statSync : fs6.lstatSync;
      for (const path_ of paths) {
        try {
          const stat2 = statFn(path8.resolve(options.cwd, path_));
          if (matchType(options.type, stat2)) {
            return path_;
          }
        } catch {
        }
      }
    };
  }
});

// ../../node_modules/path-exists/index.js
var require_path_exists = __commonJS({
  "../../node_modules/path-exists/index.js"(exports, module) {
    "use strict";
    var fs6 = __require("fs");
    var { promisify } = __require("util");
    var pAccess = promisify(fs6.access);
    module.exports = async (path8) => {
      try {
        await pAccess(path8);
        return true;
      } catch (_) {
        return false;
      }
    };
    module.exports.sync = (path8) => {
      try {
        fs6.accessSync(path8);
        return true;
      } catch (_) {
        return false;
      }
    };
  }
});

// ../../node_modules/find-up/index.js
var require_find_up = __commonJS({
  "../../node_modules/find-up/index.js"(exports, module) {
    "use strict";
    var path8 = __require("path");
    var locatePath = require_locate_path();
    var pathExists = require_path_exists();
    var stop = /* @__PURE__ */ Symbol("findUp.stop");
    module.exports = async (name, options = {}) => {
      let directory = path8.resolve(options.cwd || "");
      const { root } = path8.parse(directory);
      const paths = [].concat(name);
      const runMatcher = async (locateOptions) => {
        if (typeof name !== "function") {
          return locatePath(paths, locateOptions);
        }
        const foundPath = await name(locateOptions.cwd);
        if (typeof foundPath === "string") {
          return locatePath([foundPath], locateOptions);
        }
        return foundPath;
      };
      while (true) {
        const foundPath = await runMatcher({ ...options, cwd: directory });
        if (foundPath === stop) {
          return;
        }
        if (foundPath) {
          return path8.resolve(directory, foundPath);
        }
        if (directory === root) {
          return;
        }
        directory = path8.dirname(directory);
      }
    };
    module.exports.sync = (name, options = {}) => {
      let directory = path8.resolve(options.cwd || "");
      const { root } = path8.parse(directory);
      const paths = [].concat(name);
      const runMatcher = (locateOptions) => {
        if (typeof name !== "function") {
          return locatePath.sync(paths, locateOptions);
        }
        const foundPath = name(locateOptions.cwd);
        if (typeof foundPath === "string") {
          return locatePath.sync([foundPath], locateOptions);
        }
        return foundPath;
      };
      while (true) {
        const foundPath = runMatcher({ ...options, cwd: directory });
        if (foundPath === stop) {
          return;
        }
        if (foundPath) {
          return path8.resolve(directory, foundPath);
        }
        if (directory === root) {
          return;
        }
        directory = path8.dirname(directory);
      }
    };
    module.exports.exists = pathExists;
    module.exports.sync.exists = pathExists.sync;
    module.exports.stop = stop;
  }
});

// src/init.ts
import * as fs3 from "fs";

// src/config.ts
var DEFAULT_NPM_REGISTRY = "https://registry.npmjs.org/";

// src/utils.ts
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
import * as fs2 from "fs";
import * as os2 from "os";
import * as path4 from "path";

// ../../node_modules/@actions/exec/lib/exec.js
import { StringDecoder } from "string_decoder";

// ../../node_modules/@actions/exec/lib/toolrunner.js
import * as os from "os";
import * as events from "events";
import * as child from "child_process";
import * as path3 from "path";

// ../../node_modules/@actions/io/lib/io.js
import * as path2 from "path";

// ../../node_modules/@actions/io/lib/io-util.js
import * as fs from "fs";
import * as path from "path";
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve3) {
      resolve3(value);
    });
  }
  return new (P || (P = Promise))(function(resolve3, reject) {
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
      result.done ? resolve3(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var { chmod, copyFile, lstat, mkdir, open, readdir, rename, rm, rmdir, stat, symlink, unlink } = fs.promises;
var IS_WINDOWS = process.platform === "win32";
var READONLY = fs.constants.O_RDONLY;
function exists(fsPath) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      yield stat(fsPath);
    } catch (err) {
      if (err.code === "ENOENT") {
        return false;
      }
      throw err;
    }
    return true;
  });
}
function isRooted(p) {
  p = normalizeSeparators(p);
  if (!p) {
    throw new Error('isRooted() parameter "p" cannot be empty');
  }
  if (IS_WINDOWS) {
    return p.startsWith("\\") || /^[A-Z]:/i.test(p);
  }
  return p.startsWith("/");
}
function tryGetExecutablePath(filePath, extensions) {
  return __awaiter(this, void 0, void 0, function* () {
    let stats = void 0;
    try {
      stats = yield stat(filePath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
      }
    }
    if (stats && stats.isFile()) {
      if (IS_WINDOWS) {
        const upperExt = path.extname(filePath).toUpperCase();
        if (extensions.some((validExt) => validExt.toUpperCase() === upperExt)) {
          return filePath;
        }
      } else {
        if (isUnixExecutable(stats)) {
          return filePath;
        }
      }
    }
    const originalFilePath = filePath;
    for (const extension of extensions) {
      filePath = originalFilePath + extension;
      stats = void 0;
      try {
        stats = yield stat(filePath);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
        }
      }
      if (stats && stats.isFile()) {
        if (IS_WINDOWS) {
          try {
            const directory = path.dirname(filePath);
            const upperName = path.basename(filePath).toUpperCase();
            for (const actualName of yield readdir(directory)) {
              if (upperName === actualName.toUpperCase()) {
                filePath = path.join(directory, actualName);
                break;
              }
            }
          } catch (err) {
            console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
          }
          return filePath;
        } else {
          if (isUnixExecutable(stats)) {
            return filePath;
          }
        }
      }
    }
    return "";
  });
}
function normalizeSeparators(p) {
  p = p || "";
  if (IS_WINDOWS) {
    p = p.replace(/\//g, "\\");
    return p.replace(/\\\\+/g, "\\");
  }
  return p.replace(/\/\/+/g, "/");
}
function isUnixExecutable(stats) {
  return (stats.mode & 1) > 0 || (stats.mode & 8) > 0 && process.getgid !== void 0 && stats.gid === process.getgid() || (stats.mode & 64) > 0 && process.getuid !== void 0 && stats.uid === process.getuid();
}

// ../../node_modules/@actions/io/lib/io.js
var __awaiter2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve3) {
      resolve3(value);
    });
  }
  return new (P || (P = Promise))(function(resolve3, reject) {
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
      result.done ? resolve3(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function which(tool, check) {
  return __awaiter2(this, void 0, void 0, function* () {
    if (!tool) {
      throw new Error("parameter 'tool' is required");
    }
    if (check) {
      const result = yield which(tool, false);
      if (!result) {
        if (IS_WINDOWS) {
          throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
        } else {
          throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
        }
      }
      return result;
    }
    const matches = yield findInPath(tool);
    if (matches && matches.length > 0) {
      return matches[0];
    }
    return "";
  });
}
function findInPath(tool) {
  return __awaiter2(this, void 0, void 0, function* () {
    if (!tool) {
      throw new Error("parameter 'tool' is required");
    }
    const extensions = [];
    if (IS_WINDOWS && process.env["PATHEXT"]) {
      for (const extension of process.env["PATHEXT"].split(path2.delimiter)) {
        if (extension) {
          extensions.push(extension);
        }
      }
    }
    if (isRooted(tool)) {
      const filePath = yield tryGetExecutablePath(tool, extensions);
      if (filePath) {
        return [filePath];
      }
      return [];
    }
    if (tool.includes(path2.sep)) {
      return [];
    }
    const directories = [];
    if (process.env.PATH) {
      for (const p of process.env.PATH.split(path2.delimiter)) {
        if (p) {
          directories.push(p);
        }
      }
    }
    const matches = [];
    for (const directory of directories) {
      const filePath = yield tryGetExecutablePath(path2.join(directory, tool), extensions);
      if (filePath) {
        matches.push(filePath);
      }
    }
    return matches;
  });
}

// ../../node_modules/@actions/exec/lib/toolrunner.js
import { setTimeout as setTimeout2 } from "timers";
var __awaiter3 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve3) {
      resolve3(value);
    });
  }
  return new (P || (P = Promise))(function(resolve3, reject) {
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
      result.done ? resolve3(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var IS_WINDOWS2 = process.platform === "win32";
var ToolRunner = class extends events.EventEmitter {
  constructor(toolPath, args, options) {
    super();
    if (!toolPath) {
      throw new Error("Parameter 'toolPath' cannot be null or empty.");
    }
    this.toolPath = toolPath;
    this.args = args || [];
    this.options = options || {};
  }
  _debug(message) {
    if (this.options.listeners && this.options.listeners.debug) {
      this.options.listeners.debug(message);
    }
  }
  _getCommandString(options, noPrefix) {
    const toolPath = this._getSpawnFileName();
    const args = this._getSpawnArgs(options);
    let cmd = noPrefix ? "" : "[command]";
    if (IS_WINDOWS2) {
      if (this._isCmdFile()) {
        cmd += toolPath;
        for (const a of args) {
          cmd += ` ${a}`;
        }
      } else if (options.windowsVerbatimArguments) {
        cmd += `"${toolPath}"`;
        for (const a of args) {
          cmd += ` ${a}`;
        }
      } else {
        cmd += this._windowsQuoteCmdArg(toolPath);
        for (const a of args) {
          cmd += ` ${this._windowsQuoteCmdArg(a)}`;
        }
      }
    } else {
      cmd += toolPath;
      for (const a of args) {
        cmd += ` ${a}`;
      }
    }
    return cmd;
  }
  _processLineBuffer(data, strBuffer, onLine) {
    try {
      let s = strBuffer + data.toString();
      let n = s.indexOf(os.EOL);
      while (n > -1) {
        const line = s.substring(0, n);
        onLine(line);
        s = s.substring(n + os.EOL.length);
        n = s.indexOf(os.EOL);
      }
      return s;
    } catch (err) {
      this._debug(`error processing line. Failed with error ${err}`);
      return "";
    }
  }
  _getSpawnFileName() {
    if (IS_WINDOWS2) {
      if (this._isCmdFile()) {
        return process.env["COMSPEC"] || "cmd.exe";
      }
    }
    return this.toolPath;
  }
  _getSpawnArgs(options) {
    if (IS_WINDOWS2) {
      if (this._isCmdFile()) {
        let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
        for (const a of this.args) {
          argline += " ";
          argline += options.windowsVerbatimArguments ? a : this._windowsQuoteCmdArg(a);
        }
        argline += '"';
        return [argline];
      }
    }
    return this.args;
  }
  _endsWith(str, end) {
    return str.endsWith(end);
  }
  _isCmdFile() {
    const upperToolPath = this.toolPath.toUpperCase();
    return this._endsWith(upperToolPath, ".CMD") || this._endsWith(upperToolPath, ".BAT");
  }
  _windowsQuoteCmdArg(arg) {
    if (!this._isCmdFile()) {
      return this._uvQuoteCmdArg(arg);
    }
    if (!arg) {
      return '""';
    }
    const cmdSpecialChars = [
      " ",
      "	",
      "&",
      "(",
      ")",
      "[",
      "]",
      "{",
      "}",
      "^",
      "=",
      ";",
      "!",
      "'",
      "+",
      ",",
      "`",
      "~",
      "|",
      "<",
      ">",
      '"'
    ];
    let needsQuotes = false;
    for (const char of arg) {
      if (cmdSpecialChars.some((x) => x === char)) {
        needsQuotes = true;
        break;
      }
    }
    if (!needsQuotes) {
      return arg;
    }
    let reverse = '"';
    let quoteHit = true;
    for (let i = arg.length; i > 0; i--) {
      reverse += arg[i - 1];
      if (quoteHit && arg[i - 1] === "\\") {
        reverse += "\\";
      } else if (arg[i - 1] === '"') {
        quoteHit = true;
        reverse += '"';
      } else {
        quoteHit = false;
      }
    }
    reverse += '"';
    return reverse.split("").reverse().join("");
  }
  _uvQuoteCmdArg(arg) {
    if (!arg) {
      return '""';
    }
    if (!arg.includes(" ") && !arg.includes("	") && !arg.includes('"')) {
      return arg;
    }
    if (!arg.includes('"') && !arg.includes("\\")) {
      return `"${arg}"`;
    }
    let reverse = '"';
    let quoteHit = true;
    for (let i = arg.length; i > 0; i--) {
      reverse += arg[i - 1];
      if (quoteHit && arg[i - 1] === "\\") {
        reverse += "\\";
      } else if (arg[i - 1] === '"') {
        quoteHit = true;
        reverse += "\\";
      } else {
        quoteHit = false;
      }
    }
    reverse += '"';
    return reverse.split("").reverse().join("");
  }
  _cloneExecOptions(options) {
    options = options || {};
    const result = {
      cwd: options.cwd || process.cwd(),
      env: options.env || process.env,
      silent: options.silent || false,
      windowsVerbatimArguments: options.windowsVerbatimArguments || false,
      failOnStdErr: options.failOnStdErr || false,
      ignoreReturnCode: options.ignoreReturnCode || false,
      delay: options.delay || 1e4
    };
    result.outStream = options.outStream || process.stdout;
    result.errStream = options.errStream || process.stderr;
    return result;
  }
  _getSpawnOptions(options, toolPath) {
    options = options || {};
    const result = {};
    result.cwd = options.cwd;
    result.env = options.env;
    result["windowsVerbatimArguments"] = options.windowsVerbatimArguments || this._isCmdFile();
    if (options.windowsVerbatimArguments) {
      result.argv0 = `"${toolPath}"`;
    }
    return result;
  }
  /**
   * Exec a tool.
   * Output will be streamed to the live console.
   * Returns promise with return code
   *
   * @param     tool     path to tool to exec
   * @param     options  optional exec options.  See ExecOptions
   * @returns   number
   */
  exec() {
    return __awaiter3(this, void 0, void 0, function* () {
      if (!isRooted(this.toolPath) && (this.toolPath.includes("/") || IS_WINDOWS2 && this.toolPath.includes("\\"))) {
        this.toolPath = path3.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
      }
      this.toolPath = yield which(this.toolPath, true);
      return new Promise((resolve3, reject) => __awaiter3(this, void 0, void 0, function* () {
        this._debug(`exec tool: ${this.toolPath}`);
        this._debug("arguments:");
        for (const arg of this.args) {
          this._debug(`   ${arg}`);
        }
        const optionsNonNull = this._cloneExecOptions(this.options);
        if (!optionsNonNull.silent && optionsNonNull.outStream) {
          optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
        }
        const state = new ExecState(optionsNonNull, this.toolPath);
        state.on("debug", (message) => {
          this._debug(message);
        });
        if (this.options.cwd && !(yield exists(this.options.cwd))) {
          return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
        }
        const fileName = this._getSpawnFileName();
        const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
        let stdbuffer = "";
        if (cp.stdout) {
          cp.stdout.on("data", (data) => {
            if (this.options.listeners && this.options.listeners.stdout) {
              this.options.listeners.stdout(data);
            }
            if (!optionsNonNull.silent && optionsNonNull.outStream) {
              optionsNonNull.outStream.write(data);
            }
            stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
              if (this.options.listeners && this.options.listeners.stdline) {
                this.options.listeners.stdline(line);
              }
            });
          });
        }
        let errbuffer = "";
        if (cp.stderr) {
          cp.stderr.on("data", (data) => {
            state.processStderr = true;
            if (this.options.listeners && this.options.listeners.stderr) {
              this.options.listeners.stderr(data);
            }
            if (!optionsNonNull.silent && optionsNonNull.errStream && optionsNonNull.outStream) {
              const s = optionsNonNull.failOnStdErr ? optionsNonNull.errStream : optionsNonNull.outStream;
              s.write(data);
            }
            errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
              if (this.options.listeners && this.options.listeners.errline) {
                this.options.listeners.errline(line);
              }
            });
          });
        }
        cp.on("error", (err) => {
          state.processError = err.message;
          state.processExited = true;
          state.processClosed = true;
          state.CheckComplete();
        });
        cp.on("exit", (code) => {
          state.processExitCode = code;
          state.processExited = true;
          this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
          state.CheckComplete();
        });
        cp.on("close", (code) => {
          state.processExitCode = code;
          state.processExited = true;
          state.processClosed = true;
          this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
          state.CheckComplete();
        });
        state.on("done", (error, exitCode) => {
          if (stdbuffer.length > 0) {
            this.emit("stdline", stdbuffer);
          }
          if (errbuffer.length > 0) {
            this.emit("errline", errbuffer);
          }
          cp.removeAllListeners();
          if (error) {
            reject(error);
          } else {
            resolve3(exitCode);
          }
        });
        if (this.options.input) {
          if (!cp.stdin) {
            throw new Error("child process missing stdin");
          }
          cp.stdin.end(this.options.input);
        }
      }));
    });
  }
};
function argStringToArray(argString) {
  const args = [];
  let inQuotes = false;
  let escaped = false;
  let arg = "";
  function append(c) {
    if (escaped && c !== '"') {
      arg += "\\";
    }
    arg += c;
    escaped = false;
  }
  for (let i = 0; i < argString.length; i++) {
    const c = argString.charAt(i);
    if (c === '"') {
      if (!escaped) {
        inQuotes = !inQuotes;
      } else {
        append(c);
      }
      continue;
    }
    if (c === "\\" && escaped) {
      append(c);
      continue;
    }
    if (c === "\\" && inQuotes) {
      escaped = true;
      continue;
    }
    if (c === " " && !inQuotes) {
      if (arg.length > 0) {
        args.push(arg);
        arg = "";
      }
      continue;
    }
    append(c);
  }
  if (arg.length > 0) {
    args.push(arg.trim());
  }
  return args;
}
var ExecState = class _ExecState extends events.EventEmitter {
  constructor(options, toolPath) {
    super();
    this.processClosed = false;
    this.processError = "";
    this.processExitCode = 0;
    this.processExited = false;
    this.processStderr = false;
    this.delay = 1e4;
    this.done = false;
    this.timeout = null;
    if (!toolPath) {
      throw new Error("toolPath must not be empty");
    }
    this.options = options;
    this.toolPath = toolPath;
    if (options.delay) {
      this.delay = options.delay;
    }
  }
  CheckComplete() {
    if (this.done) {
      return;
    }
    if (this.processClosed) {
      this._setResult();
    } else if (this.processExited) {
      this.timeout = setTimeout2(_ExecState.HandleTimeout, this.delay, this);
    }
  }
  _debug(message) {
    this.emit("debug", message);
  }
  _setResult() {
    let error;
    if (this.processExited) {
      if (this.processError) {
        error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
      } else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
        error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
      } else if (this.processStderr && this.options.failOnStdErr) {
        error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
      }
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.done = true;
    this.emit("done", error, this.processExitCode);
  }
  static HandleTimeout(state) {
    if (state.done) {
      return;
    }
    if (!state.processClosed && state.processExited) {
      const message = `The STDIO streams did not close within ${state.delay / 1e3} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
      state._debug(message);
    }
    state._setResult();
  }
};

// ../../node_modules/@actions/exec/lib/exec.js
var __awaiter4 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve3) {
      resolve3(value);
    });
  }
  return new (P || (P = Promise))(function(resolve3, reject) {
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
      result.done ? resolve3(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function exec(commandLine, args, options) {
  return __awaiter4(this, void 0, void 0, function* () {
    const commandArgs = argStringToArray(commandLine);
    if (commandArgs.length === 0) {
      throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
    }
    const toolPath = commandArgs[0];
    args = commandArgs.slice(1).concat(args || []);
    const runner = new ToolRunner(toolPath, args, options);
    return runner.exec();
  });
}
function getExecOutput(commandLine, args, options) {
  return __awaiter4(this, void 0, void 0, function* () {
    var _a, _b;
    let stdout = "";
    let stderr = "";
    const stdoutDecoder = new StringDecoder("utf8");
    const stderrDecoder = new StringDecoder("utf8");
    const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
    const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
    const stdErrListener = (data) => {
      stderr += stderrDecoder.write(data);
      if (originalStdErrListener) {
        originalStdErrListener(data);
      }
    };
    const stdOutListener = (data) => {
      stdout += stdoutDecoder.write(data);
      if (originalStdoutListener) {
        originalStdoutListener(data);
      }
    };
    const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
    const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
    stdout += stdoutDecoder.end();
    stderr += stderrDecoder.end();
    return {
      exitCode,
      stdout,
      stderr
    };
  });
}

// src/utils.ts
import { utils } from "./core";
async function npmAddTag(context, pkgSpec, tag, registry, inDir) {
  const registryPrefix = pkgSpec.startsWith("@") ? `${pkgSpec.split("/")[0]}:` : "";
  const cmdArgs = ["dist-tag", "add", pkgSpec, tag, `--${registryPrefix}registry=${registry}`];
  await utils.dryRunTask(context, `npm ${cmdArgs.join(" ")}`, async () => {
    await exec("npm", cmdArgs, { cwd: inDir });
  });
}
async function npmConfig(context, registry, useTokenAuth = true) {
  const npmrcLines = [];
  const registrySpec = (registry.endsWith("/") ? registry : registry + "/").replace(/^\w+:/, "");
  if (useTokenAuth) {
    npmrcLines.push(`${registrySpec}:_authToken=${context.env.NPM_TOKEN}`);
  } else {
    const b64Auth = Buffer.from(`${context.env.NPM_USERNAME}:${context.env.NPM_PASSWORD}`).toString("base64");
    npmrcLines.push(`${registrySpec}:_auth=${b64Auth}`);
    npmrcLines.push(`${registrySpec}:email=${context.env.NPM_EMAIL}`);
  }
  fs2.appendFileSync(path4.join(os2.homedir(), ".npmrc"), npmrcLines.join("\n"));
  await exec("npm", ["whoami", "--registry", registry]);
}
async function npmInstall(pkgSpec, registry, inDir) {
  const registryPrefix = pkgSpec.startsWith("@") ? `${pkgSpec.split("/")[0]}:` : "";
  await exec("npm", ["install", pkgSpec, `--${registryPrefix}registry=${registry}`], { cwd: inDir });
}
async function npmPack(pkgSpec, registry, inDir) {
  const registryPrefix = pkgSpec.startsWith("@") ? `${pkgSpec.split("/")[0]}:` : "";
  const cmdArgs = ["pack", `--${registryPrefix}registry=${registry}`];
  const cmdOutput = await getExecOutput("npm", cmdArgs, { cwd: inDir });
  return cmdOutput.stdout.trim().split(/\s+/).pop();
}
async function npmPublish(context, options) {
  const registryPrefix = options.pkgSpec.startsWith("@") ? `${options.pkgSpec.split("/")[0]}:` : "";
  const cmdArgs = ["publish", "--tag", options.tag, `--${registryPrefix}registry=${options.registry}`];
  if (context.dryRun) {
    cmdArgs.push("--dry-run");
  }
  await exec("npm", cmdArgs, { cwd: options.inDir });
}
async function npmVersion(newVersion, inDir) {
  await exec("npm", [
    "version",
    newVersion,
    "--allow-same-version",
    "--no-git-tag-version",
    "--no-workspaces-update"
  ], { cwd: inDir });
}
async function npmView(pkgSpec, registry, property) {
  const registryPrefix = pkgSpec.startsWith("@") ? `${pkgSpec.split("/")[0]}:` : "";
  const cmdArgs = ["view", `${pkgSpec}`, "--json", `--${registryPrefix}registry=${registry}`];
  if (property != null) {
    cmdArgs.push(property);
  }
  try {
    const cmdOutput = await getExecOutput("npm", cmdArgs);
    return JSON.parse(cmdOutput.stdout.trim());
  } catch {
  }
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

// src/init.ts
async function init_default(context, config) {
  let publishConfig;
  try {
    const packageJson = JSON.parse(fs3.readFileSync("package.json", "utf-8"));
    publishConfig = packageJson.publishConfig;
    if (context.workspaces == null) {
      context.version.new = packageJson.version;
    } else {
      context.logger.warn("Ignoring package.json version in workspaces");
    }
  } catch {
    throw new Error(`Missing or invalid package.json in branch ${context.branch.name}`);
  }
  if (config.pruneShrinkwrap && !fs3.existsSync("npm-shrinkwrap.json")) {
    throw new Error("Could not find npm-shrinkwrap.json but the pruneShrinkwrap option was specified");
  }
  context.branch.channel = context.branch.channel || "latest";
  if (config.npmPublish === false) {
    return;
  }
  const useTokenAuth = verifyConditions(context);
  await npmConfig(context, publishConfig?.registry || DEFAULT_NPM_REGISTRY, useTokenAuth);
}

// src/publish.ts
import * as fs4 from "fs";
import * as path5 from "path";
async function publish_default(context, config, inDir) {
  const cwd = inDir || process.cwd();
  const packageJson = JSON.parse(fs4.readFileSync(path5.join(cwd, "package.json"), "utf-8"));
  const npmRegistry = packageJson.publishConfig?.registry || DEFAULT_NPM_REGISTRY;
  if (config.pruneShrinkwrap) {
    if (packageJson.scripts.preshrinkwrap != null) {
      await exec("npm", ["run", "preshrinkwrap"], { cwd });
    }
    pruneShrinkwrap(context, inDir);
  }
  if (config.tarballDir != null) {
    const tgzFile = await npmPack(packageJson.name, npmRegistry, inDir);
    fs4.mkdirSync(config.tarballDir, { recursive: true });
    fs4.renameSync(path5.join(cwd, tgzFile), path5.resolve(context.rootDir, config.tarballDir, tgzFile));
  }
  if (config.npmPublish === false) {
    return;
  } else if (fs4.existsSync(".npmrc")) {
    fs4.renameSync(".npmrc", ".npmrc.bak");
  }
  if (packageJson.private) {
    context.logger.info(`Skipping publish of private package ${packageJson.name}`);
    return;
  }
  try {
    const packageTag = context.branch.channel;
    const publishedVersions = await npmView(packageJson.name, npmRegistry, "versions");
    if (!publishedVersions?.includes(packageJson.version)) {
      await npmPublish(context, {
        tag: packageTag,
        pkgSpec: packageJson.name,
        registry: npmRegistry,
        inDir
      });
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
    if (config.aliasTags?.[packageTag] != null) {
      const aliasTagOrTags = config.aliasTags[packageTag];
      aliasTags.push(...typeof aliasTagOrTags === "string" ? [aliasTagOrTags] : aliasTagOrTags);
    }
    for (const tag of [packageTag, ...aliasTags]) {
      await npmAddTag(context, `${packageJson.name}@${packageJson.version}`, tag, npmRegistry, inDir);
    }
  } finally {
    if (fs4.existsSync(".npmrc.bak")) {
      fs4.renameSync(".npmrc.bak", ".npmrc");
    }
  }
}
function pruneShrinkwrap(context, inDir) {
  const shrinkwrapPath = inDir != null ? path5.join(inDir, "npm-shrinkwrap.json") : "npm-shrinkwrap.json";
  const lockfile = JSON.parse(fs4.readFileSync(shrinkwrapPath, "utf-8"));
  const filterPkgs = (obj, key) => {
    for (const [pkgName, pkgData] of Object.entries(obj[key])) {
      if (["dev", "extraneous"].some((prop) => pkgData[prop])) {
        delete obj[key][pkgName];
      }
    }
  };
  filterPkgs(lockfile, "packages");
  if (lockfile.lockfileVersion < 3) {
    filterPkgs(lockfile, "dependencies");
  } else {
    context.logger.info("lockfileVersion 3 does not contain a 'dependencies' object.");
  }
  fs4.writeFileSync(shrinkwrapPath, JSON.stringify(lockfile, null, 2) + "\n");
}

// src/success.ts
var import_delay = __toESM(require_delay());
import * as fs5 from "fs";
import * as os3 from "os";
import * as path6 from "path";
import { utils as coreUtils } from "./core";
async function success_default(context, config) {
  if (config.smokeTest && context.releasedPackages.npm != null) {
    context.logger.info("Performing smoke test, installing released package(s)");
    for (const { name, registry } of context.releasedPackages.npm) {
      const tmpDir = path6.join(os3.tmpdir(), context.ci.build, name);
      fs5.mkdirSync(tmpDir, { recursive: true });
      let tries = 0;
      while (await npmView(name, registry) == null && tries < 60) {
        await (0, import_delay.default)(1e3);
        tries += 1;
      }
      await coreUtils.dryRunTask(context, `install ${name} from ${registry}`, async () => {
        await npmInstall(name, registry, tmpDir);
      });
      fs5.rmdirSync(tmpDir, { recursive: true });
    }
  }
}

// src/version.ts
var import_find_up = __toESM(require_find_up());
import * as path7 from "path";
async function version_default(context, _config) {
  if (context.workspaces != null) {
    context.logger.warn("Cannot run npm version in workspaces");
    return;
  } else if (context.version.old === context.version.new) {
    context.logger.info("Version in package.json is already up to date");
    return;
  }
  await npmVersion(context.version.new);
  context.changedFiles.push("package.json");
  const lockfilePath = await (0, import_find_up.default)(["npm-shrinkwrap.json", "package-lock.json"]);
  if (lockfilePath != null) {
    context.changedFiles.push(path7.relative(context.rootDir, lockfilePath));
  } else {
    context.logger.warn("Could not find lockfile to update version in");
  }
}
export {
  DEFAULT_NPM_REGISTRY,
  init_default as init,
  publish_default as publish,
  success_default as success,
  utils_exports as utils,
  version_default as version
};
