"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  fail: () => init_default,
  init: () => init_default,
  publish: () => publish_default,
  success: () => success_default,
  version: () => version_default
});
module.exports = __toCommonJS(index_exports);

// ../../node_modules/@actions/exec/lib/toolrunner.js
var os = __toESM(require("os"), 1);
var events = __toESM(require("events"), 1);
var child = __toESM(require("child_process"), 1);
var path3 = __toESM(require("path"), 1);

// ../../node_modules/@actions/io/lib/io.js
var path2 = __toESM(require("path"), 1);

// ../../node_modules/@actions/io/lib/io-util.js
var fs = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);
var __awaiter = function(thisArg, _arguments, P, generator) {
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
var import_timers = require("timers");
var __awaiter3 = function(thisArg, _arguments, P, generator) {
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
      return new Promise((resolve2, reject) => __awaiter3(this, void 0, void 0, function* () {
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
            resolve2(exitCode);
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
      this.timeout = (0, import_timers.setTimeout)(_ExecState.HandleTimeout, this.delay, this);
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

// src/utils.ts
var import_core = require("./core");
async function runCmd(context, command, dryRunAllow = false) {
  const task = async () => {
    const exitCode = await exec(command);
    context.logger.debug(`Process finished with exit code ${exitCode}`);
  };
  if (!dryRunAllow) {
    await import_core.utils.dryRunTask(context, command, task);
  } else {
    await task();
  }
}

// src/init.ts
async function init_default(context, config) {
  if (config.initCmd != null) {
    await runCmd(context, config.initCmd, config.dryRunAllow?.includes("init"));
  }
}

// src/publish.ts
async function publish_default(context, config) {
  if (config.publishCmd != null) {
    await runCmd(context, config.publishCmd, config.dryRunAllow?.includes("publish"));
  }
}

// src/success.ts
async function success_default(context, config) {
  if (config.successCmd != null) {
    await runCmd(context, config.successCmd, config.dryRunAllow?.includes("success"));
  }
}

// src/version.ts
async function version_default(context, config) {
  if (config.versionCmd != null) {
    await runCmd(context, config.versionCmd, config.dryRunAllow?.includes("version"));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fail,
  init,
  publish,
  success,
  version
});
