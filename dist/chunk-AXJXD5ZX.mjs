import { createRequire } from 'module'; const require = createRequire(import.meta.url);
import {
  __commonJS
} from "./chunk-R3TGK222.mjs";

// node_modules/delay/index.js
var require_delay = __commonJS({
  "node_modules/delay/index.js"(exports, module) {
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
      const delayPromise = new Promise((resolve, reject) => {
        settle = () => {
          cleanup();
          if (willResolve) {
            resolve(value);
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
      const delay2 = createDelay({ ...clearAndSet, willResolve: true });
      delay2.reject = createDelay({ ...clearAndSet, willResolve: false });
      delay2.range = (minimum, maximum, options) => delay2(randomInteger(minimum, maximum), options);
      return delay2;
    };
    var delay = createWithTimers();
    delay.createWithTimers = createWithTimers;
    module.exports = delay;
    module.exports.default = delay;
  }
});

export {
  require_delay
};
