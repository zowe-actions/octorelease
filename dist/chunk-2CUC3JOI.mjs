import { createRequire } from 'module'; const require = createRequire(import.meta.url);
import {
  __commonJS,
  __require
} from "./chunk-R3TGK222.mjs";

// node_modules/yocto-queue/index.js
var require_yocto_queue = __commonJS({
  "node_modules/yocto-queue/index.js"(exports, module) {
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

// node_modules/p-limit/index.js
var require_p_limit = __commonJS({
  "node_modules/p-limit/index.js"(exports, module) {
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
      const run = async (fn, resolve, ...args) => {
        activeCount++;
        const result = (async () => fn(...args))();
        resolve(result);
        try {
          await result;
        } catch {
        }
        next();
      };
      const enqueue = (fn, resolve, ...args) => {
        queue.enqueue(run.bind(null, fn, resolve, ...args));
        (async () => {
          await Promise.resolve();
          if (activeCount < concurrency && queue.size > 0) {
            queue.dequeue()();
          }
        })();
      };
      const generator = (fn, ...args) => new Promise((resolve) => {
        enqueue(fn, resolve, ...args);
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

// node_modules/p-locate/index.js
var require_p_locate = __commonJS({
  "node_modules/p-locate/index.js"(exports, module) {
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

// node_modules/locate-path/index.js
var require_locate_path = __commonJS({
  "node_modules/locate-path/index.js"(exports, module) {
    "use strict";
    var path = __require("path");
    var fs = __require("fs");
    var { promisify } = __require("util");
    var pLocate = require_p_locate();
    var fsStat = promisify(fs.stat);
    var fsLStat = promisify(fs.lstat);
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
          const stat = await statFn(path.resolve(options.cwd, path_));
          return matchType(options.type, stat);
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
      const statFn = options.allowSymlinks ? fs.statSync : fs.lstatSync;
      for (const path_ of paths) {
        try {
          const stat = statFn(path.resolve(options.cwd, path_));
          if (matchType(options.type, stat)) {
            return path_;
          }
        } catch {
        }
      }
    };
  }
});

// node_modules/path-exists/index.js
var require_path_exists = __commonJS({
  "node_modules/path-exists/index.js"(exports, module) {
    "use strict";
    var fs = __require("fs");
    var { promisify } = __require("util");
    var pAccess = promisify(fs.access);
    module.exports = async (path) => {
      try {
        await pAccess(path);
        return true;
      } catch (_) {
        return false;
      }
    };
    module.exports.sync = (path) => {
      try {
        fs.accessSync(path);
        return true;
      } catch (_) {
        return false;
      }
    };
  }
});

// node_modules/find-up/index.js
var require_find_up = __commonJS({
  "node_modules/find-up/index.js"(exports, module) {
    "use strict";
    var path = __require("path");
    var locatePath = require_locate_path();
    var pathExists = require_path_exists();
    var stop = Symbol("findUp.stop");
    module.exports = async (name, options = {}) => {
      let directory = path.resolve(options.cwd || "");
      const { root } = path.parse(directory);
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
          return path.resolve(directory, foundPath);
        }
        if (directory === root) {
          return;
        }
        directory = path.dirname(directory);
      }
    };
    module.exports.sync = (name, options = {}) => {
      let directory = path.resolve(options.cwd || "");
      const { root } = path.parse(directory);
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
          return path.resolve(directory, foundPath);
        }
        if (directory === root) {
          return;
        }
        directory = path.dirname(directory);
      }
    };
    module.exports.exists = pathExists;
    module.exports.sync.exists = pathExists.sync;
    module.exports.stop = stop;
  }
});

export {
  require_find_up
};
