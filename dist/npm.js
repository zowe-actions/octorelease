"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/@actions/io/lib/io-util.js
var require_io_util = __commonJS({
  "../../node_modules/@actions/io/lib/io-util.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
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
    var _a;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getCmdPath = exports2.tryGetExecutablePath = exports2.isRooted = exports2.isDirectory = exports2.exists = exports2.IS_WINDOWS = exports2.unlink = exports2.symlink = exports2.stat = exports2.rmdir = exports2.rename = exports2.readlink = exports2.readdir = exports2.mkdir = exports2.lstat = exports2.copyFile = exports2.chmod = void 0;
    var fs5 = __importStar(require("fs"));
    var path5 = __importStar(require("path"));
    _a = fs5.promises, exports2.chmod = _a.chmod, exports2.copyFile = _a.copyFile, exports2.lstat = _a.lstat, exports2.mkdir = _a.mkdir, exports2.readdir = _a.readdir, exports2.readlink = _a.readlink, exports2.rename = _a.rename, exports2.rmdir = _a.rmdir, exports2.stat = _a.stat, exports2.symlink = _a.symlink, exports2.unlink = _a.unlink;
    exports2.IS_WINDOWS = process.platform === "win32";
    function exists(fsPath) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          yield exports2.stat(fsPath);
        } catch (err) {
          if (err.code === "ENOENT") {
            return false;
          }
          throw err;
        }
        return true;
      });
    }
    exports2.exists = exists;
    function isDirectory(fsPath, useStat = false) {
      return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports2.stat(fsPath) : yield exports2.lstat(fsPath);
        return stats.isDirectory();
      });
    }
    exports2.isDirectory = isDirectory;
    function isRooted(p) {
      p = normalizeSeparators(p);
      if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
      }
      if (exports2.IS_WINDOWS) {
        return p.startsWith("\\") || /^[A-Z]:/i.test(p);
      }
      return p.startsWith("/");
    }
    exports2.isRooted = isRooted;
    function tryGetExecutablePath(filePath, extensions) {
      return __awaiter(this, void 0, void 0, function* () {
        let stats = void 0;
        try {
          stats = yield exports2.stat(filePath);
        } catch (err) {
          if (err.code !== "ENOENT") {
            console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
          }
        }
        if (stats && stats.isFile()) {
          if (exports2.IS_WINDOWS) {
            const upperExt = path5.extname(filePath).toUpperCase();
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
            stats = yield exports2.stat(filePath);
          } catch (err) {
            if (err.code !== "ENOENT") {
              console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
          }
          if (stats && stats.isFile()) {
            if (exports2.IS_WINDOWS) {
              try {
                const directory = path5.dirname(filePath);
                const upperName = path5.basename(filePath).toUpperCase();
                for (const actualName of yield exports2.readdir(directory)) {
                  if (upperName === actualName.toUpperCase()) {
                    filePath = path5.join(directory, actualName);
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
    exports2.tryGetExecutablePath = tryGetExecutablePath;
    function normalizeSeparators(p) {
      p = p || "";
      if (exports2.IS_WINDOWS) {
        p = p.replace(/\//g, "\\");
        return p.replace(/\\\\+/g, "\\");
      }
      return p.replace(/\/\/+/g, "/");
    }
    function isUnixExecutable(stats) {
      return (stats.mode & 1) > 0 || (stats.mode & 8) > 0 && stats.gid === process.getgid() || (stats.mode & 64) > 0 && stats.uid === process.getuid();
    }
    function getCmdPath() {
      var _a2;
      return (_a2 = process.env["COMSPEC"]) !== null && _a2 !== void 0 ? _a2 : `cmd.exe`;
    }
    exports2.getCmdPath = getCmdPath;
  }
});

// ../../node_modules/@actions/io/lib/io.js
var require_io = __commonJS({
  "../../node_modules/@actions/io/lib/io.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
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
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.findInPath = exports2.which = exports2.mkdirP = exports2.rmRF = exports2.mv = exports2.cp = void 0;
    var assert_1 = require("assert");
    var childProcess = __importStar(require("child_process"));
    var path5 = __importStar(require("path"));
    var util_1 = require("util");
    var ioUtil = __importStar(require_io_util());
    var exec5 = util_1.promisify(childProcess.exec);
    var execFile = util_1.promisify(childProcess.execFile);
    function cp(source, dest, options = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        if (destStat && destStat.isFile() && !force) {
          return;
        }
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory ? path5.join(dest, path5.basename(source)) : dest;
        if (!(yield ioUtil.exists(source))) {
          throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
          if (!recursive) {
            throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
          } else {
            yield cpDirRecursive(source, newDest, 0, force);
          }
        } else {
          if (path5.relative(source, newDest) === "") {
            throw new Error(`'${newDest}' and '${source}' are the same file`);
          }
          yield copyFile(source, newDest, force);
        }
      });
    }
    exports2.cp = cp;
    function mv(source, dest, options = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
          let destExists = true;
          if (yield ioUtil.isDirectory(dest)) {
            dest = path5.join(dest, path5.basename(source));
            destExists = yield ioUtil.exists(dest);
          }
          if (destExists) {
            if (options.force == null || options.force) {
              yield rmRF(dest);
            } else {
              throw new Error("Destination already exists");
            }
          }
        }
        yield mkdirP(path5.dirname(dest));
        yield ioUtil.rename(source, dest);
      });
    }
    exports2.mv = mv;
    function rmRF(inputPath) {
      return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
          if (/[*"<>|]/.test(inputPath)) {
            throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
          }
          try {
            const cmdPath = ioUtil.getCmdPath();
            if (yield ioUtil.isDirectory(inputPath, true)) {
              yield exec5(`${cmdPath} /s /c "rd /s /q "%inputPath%""`, {
                env: { inputPath }
              });
            } else {
              yield exec5(`${cmdPath} /s /c "del /f /a "%inputPath%""`, {
                env: { inputPath }
              });
            }
          } catch (err) {
            if (err.code !== "ENOENT")
              throw err;
          }
          try {
            yield ioUtil.unlink(inputPath);
          } catch (err) {
            if (err.code !== "ENOENT")
              throw err;
          }
        } else {
          let isDir = false;
          try {
            isDir = yield ioUtil.isDirectory(inputPath);
          } catch (err) {
            if (err.code !== "ENOENT")
              throw err;
            return;
          }
          if (isDir) {
            yield execFile(`rm`, [`-rf`, `${inputPath}`]);
          } else {
            yield ioUtil.unlink(inputPath);
          }
        }
      });
    }
    exports2.rmRF = rmRF;
    function mkdirP(fsPath) {
      return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, "a path argument must be provided");
        yield ioUtil.mkdir(fsPath, { recursive: true });
      });
    }
    exports2.mkdirP = mkdirP;
    function which(tool, check) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
          throw new Error("parameter 'tool' is required");
        }
        if (check) {
          const result = yield which(tool, false);
          if (!result) {
            if (ioUtil.IS_WINDOWS) {
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
    exports2.which = which;
    function findInPath(tool) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
          throw new Error("parameter 'tool' is required");
        }
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env["PATHEXT"]) {
          for (const extension of process.env["PATHEXT"].split(path5.delimiter)) {
            if (extension) {
              extensions.push(extension);
            }
          }
        }
        if (ioUtil.isRooted(tool)) {
          const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
          if (filePath) {
            return [filePath];
          }
          return [];
        }
        if (tool.includes(path5.sep)) {
          return [];
        }
        const directories = [];
        if (process.env.PATH) {
          for (const p of process.env.PATH.split(path5.delimiter)) {
            if (p) {
              directories.push(p);
            }
          }
        }
        const matches = [];
        for (const directory of directories) {
          const filePath = yield ioUtil.tryGetExecutablePath(path5.join(directory, tool), extensions);
          if (filePath) {
            matches.push(filePath);
          }
        }
        return matches;
      });
    }
    exports2.findInPath = findInPath;
    function readCopyOptions(options) {
      const force = options.force == null ? true : options.force;
      const recursive = Boolean(options.recursive);
      const copySourceDirectory = options.copySourceDirectory == null ? true : Boolean(options.copySourceDirectory);
      return { force, recursive, copySourceDirectory };
    }
    function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
      return __awaiter(this, void 0, void 0, function* () {
        if (currentDepth >= 255)
          return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
          const srcFile = `${sourceDir}/${fileName}`;
          const destFile = `${destDir}/${fileName}`;
          const srcFileStat = yield ioUtil.lstat(srcFile);
          if (srcFileStat.isDirectory()) {
            yield cpDirRecursive(srcFile, destFile, currentDepth, force);
          } else {
            yield copyFile(srcFile, destFile, force);
          }
        }
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
      });
    }
    function copyFile(srcFile, destFile, force) {
      return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
          try {
            yield ioUtil.lstat(destFile);
            yield ioUtil.unlink(destFile);
          } catch (e) {
            if (e.code === "EPERM") {
              yield ioUtil.chmod(destFile, "0666");
              yield ioUtil.unlink(destFile);
            }
          }
          const symlinkFull = yield ioUtil.readlink(srcFile);
          yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? "junction" : null);
        } else if (!(yield ioUtil.exists(destFile)) || force) {
          yield ioUtil.copyFile(srcFile, destFile);
        }
      });
    }
  }
});

// ../../node_modules/@actions/exec/lib/toolrunner.js
var require_toolrunner = __commonJS({
  "../../node_modules/@actions/exec/lib/toolrunner.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
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
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.argStringToArray = exports2.ToolRunner = void 0;
    var os3 = __importStar(require("os"));
    var events = __importStar(require("events"));
    var child = __importStar(require("child_process"));
    var path5 = __importStar(require("path"));
    var io = __importStar(require_io());
    var ioUtil = __importStar(require_io_util());
    var timers_1 = require("timers");
    var IS_WINDOWS = process.platform === "win32";
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
        if (IS_WINDOWS) {
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
          let n = s.indexOf(os3.EOL);
          while (n > -1) {
            const line = s.substring(0, n);
            onLine(line);
            s = s.substring(n + os3.EOL.length);
            n = s.indexOf(os3.EOL);
          }
          return s;
        } catch (err) {
          this._debug(`error processing line. Failed with error ${err}`);
          return "";
        }
      }
      _getSpawnFileName() {
        if (IS_WINDOWS) {
          if (this._isCmdFile()) {
            return process.env["COMSPEC"] || "cmd.exe";
          }
        }
        return this.toolPath;
      }
      _getSpawnArgs(options) {
        if (IS_WINDOWS) {
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
        return __awaiter(this, void 0, void 0, function* () {
          if (!ioUtil.isRooted(this.toolPath) && (this.toolPath.includes("/") || IS_WINDOWS && this.toolPath.includes("\\"))) {
            this.toolPath = path5.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
          }
          this.toolPath = yield io.which(this.toolPath, true);
          return new Promise((resolve2, reject) => __awaiter(this, void 0, void 0, function* () {
            this._debug(`exec tool: ${this.toolPath}`);
            this._debug("arguments:");
            for (const arg of this.args) {
              this._debug(`   ${arg}`);
            }
            const optionsNonNull = this._cloneExecOptions(this.options);
            if (!optionsNonNull.silent && optionsNonNull.outStream) {
              optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os3.EOL);
            }
            const state = new ExecState(optionsNonNull, this.toolPath);
            state.on("debug", (message) => {
              this._debug(message);
            });
            if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
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
    exports2.ToolRunner = ToolRunner;
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
    exports2.argStringToArray = argStringToArray;
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
          this.timeout = timers_1.setTimeout(_ExecState.HandleTimeout, this.delay, this);
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
  }
});

// ../../node_modules/@actions/exec/lib/exec.js
var require_exec = __commonJS({
  "../../node_modules/@actions/exec/lib/exec.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
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
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getExecOutput = exports2.exec = void 0;
    var string_decoder_1 = require("string_decoder");
    var tr = __importStar(require_toolrunner());
    function exec5(commandLine, args, options) {
      return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
          throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
      });
    }
    exports2.exec = exec5;
    function getExecOutput2(commandLine, args, options) {
      var _a, _b;
      return __awaiter(this, void 0, void 0, function* () {
        let stdout = "";
        let stderr = "";
        const stdoutDecoder = new string_decoder_1.StringDecoder("utf8");
        const stderrDecoder = new string_decoder_1.StringDecoder("utf8");
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
        const exitCode = yield exec5(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
          exitCode,
          stdout,
          stderr
        };
      });
    }
    exports2.getExecOutput = getExecOutput2;
  }
});

// ../../node_modules/delay/index.js
var require_delay = __commonJS({
  "../../node_modules/delay/index.js"(exports2, module2) {
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
      const delayPromise = new Promise((resolve2, reject) => {
        settle = () => {
          cleanup();
          if (willResolve) {
            resolve2(value);
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
    module2.exports = delay2;
    module2.exports.default = delay2;
  }
});

// ../../node_modules/yocto-queue/index.js
var require_yocto_queue = __commonJS({
  "../../node_modules/yocto-queue/index.js"(exports2, module2) {
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
    module2.exports = Queue;
  }
});

// ../../node_modules/p-limit/index.js
var require_p_limit = __commonJS({
  "../../node_modules/p-limit/index.js"(exports2, module2) {
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
      const run = async (fn, resolve2, ...args) => {
        activeCount++;
        const result = (async () => fn(...args))();
        resolve2(result);
        try {
          await result;
        } catch {
        }
        next();
      };
      const enqueue = (fn, resolve2, ...args) => {
        queue.enqueue(run.bind(null, fn, resolve2, ...args));
        (async () => {
          await Promise.resolve();
          if (activeCount < concurrency && queue.size > 0) {
            queue.dequeue()();
          }
        })();
      };
      const generator = (fn, ...args) => new Promise((resolve2) => {
        enqueue(fn, resolve2, ...args);
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
    module2.exports = pLimit;
  }
});

// ../../node_modules/p-locate/index.js
var require_p_locate = __commonJS({
  "../../node_modules/p-locate/index.js"(exports2, module2) {
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
    module2.exports = pLocate;
  }
});

// ../../node_modules/locate-path/index.js
var require_locate_path = __commonJS({
  "../../node_modules/locate-path/index.js"(exports2, module2) {
    "use strict";
    var path5 = require("path");
    var fs5 = require("fs");
    var { promisify } = require("util");
    var pLocate = require_p_locate();
    var fsStat = promisify(fs5.stat);
    var fsLStat = promisify(fs5.lstat);
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
    var matchType = (type, stat) => type === void 0 || stat[typeMappings[type]]();
    module2.exports = async (paths, options) => {
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
          const stat = await statFn(path5.resolve(options.cwd, path_));
          return matchType(options.type, stat);
        } catch {
          return false;
        }
      }, options);
    };
    module2.exports.sync = (paths, options) => {
      options = {
        cwd: process.cwd(),
        allowSymlinks: true,
        type: "file",
        ...options
      };
      checkType(options);
      const statFn = options.allowSymlinks ? fs5.statSync : fs5.lstatSync;
      for (const path_ of paths) {
        try {
          const stat = statFn(path5.resolve(options.cwd, path_));
          if (matchType(options.type, stat)) {
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
  "../../node_modules/path-exists/index.js"(exports2, module2) {
    "use strict";
    var fs5 = require("fs");
    var { promisify } = require("util");
    var pAccess = promisify(fs5.access);
    module2.exports = async (path5) => {
      try {
        await pAccess(path5);
        return true;
      } catch (_) {
        return false;
      }
    };
    module2.exports.sync = (path5) => {
      try {
        fs5.accessSync(path5);
        return true;
      } catch (_) {
        return false;
      }
    };
  }
});

// ../../node_modules/find-up/index.js
var require_find_up = __commonJS({
  "../../node_modules/find-up/index.js"(exports2, module2) {
    "use strict";
    var path5 = require("path");
    var locatePath = require_locate_path();
    var pathExists = require_path_exists();
    var stop = Symbol("findUp.stop");
    module2.exports = async (name, options = {}) => {
      let directory = path5.resolve(options.cwd || "");
      const { root } = path5.parse(directory);
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
          return path5.resolve(directory, foundPath);
        }
        if (directory === root) {
          return;
        }
        directory = path5.dirname(directory);
      }
    };
    module2.exports.sync = (name, options = {}) => {
      let directory = path5.resolve(options.cwd || "");
      const { root } = path5.parse(directory);
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
          return path5.resolve(directory, foundPath);
        }
        if (directory === root) {
          return;
        }
        directory = path5.dirname(directory);
      }
    };
    module2.exports.exists = pathExists;
    module2.exports.sync.exists = pathExists.sync;
    module2.exports.stop = stop;
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DEFAULT_NPM_REGISTRY: () => DEFAULT_NPM_REGISTRY,
  init: () => init_default,
  publish: () => publish_default,
  success: () => success_default,
  utils: () => utils_exports,
  version: () => version_default
});
module.exports = __toCommonJS(index_exports);

// src/init.ts
var fs2 = __toESM(require("fs"));

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
var fs = __toESM(require("fs"));
var os = __toESM(require("os"));
var path = __toESM(require("path"));
var exec = __toESM(require_exec());
var import_core = require("./core");
async function npmAddTag(context, pkgSpec, tag, registry, inDir) {
  const registryPrefix = pkgSpec.startsWith("@") ? `${pkgSpec.split("/")[0]}:` : "";
  const cmdArgs = ["dist-tag", "add", pkgSpec, tag, `--${registryPrefix}registry=${registry}`];
  await import_core.utils.dryRunTask(context, `npm ${cmdArgs.join(" ")}`, async () => {
    await exec.exec("npm", cmdArgs, { cwd: inDir });
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
  fs.appendFileSync(path.join(os.homedir(), ".npmrc"), npmrcLines.join("\n"));
  await exec.exec("npm", ["whoami", "--registry", registry]);
}
async function npmInstall(pkgSpec, registry, inDir) {
  const registryPrefix = pkgSpec.startsWith("@") ? `${pkgSpec.split("/")[0]}:` : "";
  await exec.exec("npm", ["install", pkgSpec, `--${registryPrefix}registry=${registry}`], { cwd: inDir });
}
async function npmPack(pkgSpec, registry, inDir) {
  const registryPrefix = pkgSpec.startsWith("@") ? `${pkgSpec.split("/")[0]}:` : "";
  const cmdArgs = ["pack", `--${registryPrefix}registry=${registry}`];
  const cmdOutput = await exec.getExecOutput("npm", cmdArgs, { cwd: inDir });
  return cmdOutput.stdout.trim().split(/\s+/).pop();
}
async function npmPublish(context, options) {
  const registryPrefix = options.pkgSpec.startsWith("@") ? `${options.pkgSpec.split("/")[0]}:` : "";
  const cmdArgs = ["publish", "--tag", options.tag, `--${registryPrefix}registry=${options.registry}`];
  if (context.dryRun) {
    cmdArgs.push("--dry-run");
  }
  await exec.exec("npm", cmdArgs, { cwd: options.inDir });
}
async function npmVersion(newVersion, inDir) {
  await exec.exec("npm", [
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
    const cmdOutput = await exec.getExecOutput("npm", cmdArgs);
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
    const packageJson = JSON.parse(fs2.readFileSync("package.json", "utf-8"));
    publishConfig = packageJson.publishConfig;
    if (context.workspaces == null) {
      context.version.new = packageJson.version;
    } else {
      context.logger.warn("Ignoring package.json version in workspaces");
    }
  } catch {
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
  await npmConfig(context, publishConfig?.registry || DEFAULT_NPM_REGISTRY, useTokenAuth);
}

// src/publish.ts
var fs3 = __toESM(require("fs"));
var path2 = __toESM(require("path"));
var exec3 = __toESM(require_exec());
async function publish_default(context, config, inDir) {
  const cwd = inDir || process.cwd();
  const packageJson = JSON.parse(fs3.readFileSync(path2.join(cwd, "package.json"), "utf-8"));
  const npmRegistry = packageJson.publishConfig?.registry || DEFAULT_NPM_REGISTRY;
  if (config.pruneShrinkwrap) {
    if (packageJson.scripts.preshrinkwrap != null) {
      await exec3.exec("npm", ["run", "preshrinkwrap"], { cwd });
    }
    pruneShrinkwrap(context, inDir);
  }
  if (config.tarballDir != null) {
    const tgzFile = await npmPack(packageJson.name, npmRegistry, inDir);
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
    if (fs3.existsSync(".npmrc.bak")) {
      fs3.renameSync(".npmrc.bak", ".npmrc");
    }
  }
}
function pruneShrinkwrap(context, inDir) {
  const shrinkwrapPath = inDir != null ? path2.join(inDir, "npm-shrinkwrap.json") : "npm-shrinkwrap.json";
  const lockfile = JSON.parse(fs3.readFileSync(shrinkwrapPath, "utf-8"));
  const filterPkgs = (obj, key) => {
    if (obj[key] == null) {
      if (key === "dependencies" && lockfile.lockfileVersion === 3) {
        context.logger.info("'Dependencies' is not supported in lockfileVersion 3.");
      }
      context.logger.info(`Property '${key}' does not exist. Skipping prune operation!`);
      return;
    }
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

// src/success.ts
var fs4 = __toESM(require("fs"));
var os2 = __toESM(require("os"));
var path3 = __toESM(require("path"));
var import_core2 = require("./core");
var import_delay = __toESM(require_delay());
async function success_default(context, config) {
  if (config.smokeTest && context.releasedPackages.npm != null) {
    context.logger.info("Performing smoke test, installing released package(s)");
    for (const { name, registry } of context.releasedPackages.npm) {
      const tmpDir = path3.join(os2.tmpdir(), context.ci.build, name);
      fs4.mkdirSync(tmpDir, { recursive: true });
      let tries = 0;
      while (await npmView(name, registry) == null && tries < 60) {
        await (0, import_delay.default)(1e3);
        tries += 1;
      }
      await import_core2.utils.dryRunTask(context, `install ${name} from ${registry}`, async () => {
        await npmInstall(name, registry, tmpDir);
      });
      fs4.rmdirSync(tmpDir, { recursive: true });
    }
  }
}

// src/version.ts
var path4 = __toESM(require("path"));
var import_find_up = __toESM(require_find_up());
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
    context.changedFiles.push(path4.relative(context.rootDir, lockfilePath));
  } else {
    context.logger.warn("Could not find lockfile to update version in");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_NPM_REGISTRY,
  init,
  publish,
  success,
  utils,
  version
});
