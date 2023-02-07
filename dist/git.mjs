import { createRequire } from 'module'; const require = createRequire(import.meta.url);
import {
  require_exec
} from "./chunk-X2EBWIRY.mjs";
import {
  __async,
  __export,
  __toESM
} from "./chunk-R3TGK222.mjs";

// packages/git/src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  gitAdd: () => gitAdd,
  gitCommit: () => gitCommit,
  gitConfig: () => gitConfig,
  gitPush: () => gitPush,
  gitTag: () => gitTag
});
var exec = __toESM(require_exec());
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as url from "url";
function gitAdd(...files) {
  return __async(this, null, function* () {
    yield exec.exec("git", ["add", ...files]);
  });
}
function gitCommit(message, amend) {
  return __async(this, null, function* () {
    if (!amend) {
      const cmdOutput = yield exec.getExecOutput("git", ["diff", "--name-only", "--cached"]);
      if (cmdOutput.stdout.trim().length == 0) {
        return false;
      }
    }
    const cmdArgs = ["commit", "-s", "-m", message.includes("[ci skip]") ? message : `${message} [ci skip]`];
    if (amend) {
      cmdArgs.push("--amend");
    }
    yield exec.exec("git", cmdArgs);
    return true;
  });
}
function gitConfig(context) {
  return __async(this, null, function* () {
    yield exec.exec("git", ["config", "--global", "user.name", context.env.GIT_COMMITTER_NAME]);
    yield exec.exec("git", ["config", "--global", "user.email", context.env.GIT_COMMITTER_EMAIL]);
    if (context.env.GIT_CREDENTIALS != null) {
      yield exec.exec("git", ["config", "--global", "credential.helper", "store"]);
      const cmdOutput = yield exec.getExecOutput("git", ["config", "--get", "remote.origin.url"]);
      const gitUrl = new url.URL(cmdOutput.stdout);
      fs.appendFileSync(
        path.join(os.homedir(), ".git-credentials"),
        `${gitUrl.protocol}//${context.env.GIT_CREDENTIALS}@${gitUrl.host}`
      );
    }
    yield exec.exec("git", ["ls-remote", "--heads", "origin", context.branch.name]);
  });
}
function gitPush(context, branch, tags) {
  return __async(this, null, function* () {
    if (!tags) {
      const cmdOutput = yield exec.getExecOutput("git", ["cherry"]);
      if (cmdOutput.stdout.trim().length == 0) {
        return false;
      }
    }
    const cmdArgs = ["push", "-u", "origin", branch];
    if (tags) {
      cmdArgs.push("--follow-tags");
    }
    if (context.dryRun) {
      cmdArgs.push("--dry-run");
    }
    yield exec.exec("git", cmdArgs);
    return true;
  });
}
function gitTag(tagName, message) {
  return __async(this, null, function* () {
    const cmdOutput = yield exec.getExecOutput("git", ["tag", "-l", tagName]);
    if (cmdOutput.stdout.trim().length > 0) {
      return false;
    }
    const cmdArgs = ["tag", tagName];
    if (message != null) {
      cmdArgs.push("-a", "-m", message);
    }
    yield exec.exec("git", cmdArgs);
    return true;
  });
}

// packages/git/src/init.ts
function init_default(context, _config) {
  return __async(this, null, function* () {
    if (context.env.GIT_COMMITTER_NAME == null) {
      throw new Error("Required environment variable GIT_COMMITTER_NAME is undefined");
    }
    if (context.env.GIT_COMMITTER_EMAIL == null) {
      throw new Error("Required environment variable GIT_COMMITTER_EMAIL is undefined");
    }
    yield gitConfig(context);
  });
}

// packages/git/src/version.ts
function version_default(context, config) {
  return __async(this, null, function* () {
    const commitMessage = config.commitMessage || "Bump version to {{version}}";
    let tagMessage = config.tagMessage || context.branch.channel && `Release {{version}} to ${context.branch.channel}`;
    yield gitAdd(...new Set(context.changedFiles));
    let shouldPush = false;
    if (yield gitCommit(commitMessage.replace("{{version}}", context.version.new))) {
      shouldPush = true;
    } else {
      context.logger.warn("Nothing to commit");
    }
    tagMessage = tagMessage == null ? void 0 : tagMessage.replace("{{version}}", context.version.new);
    if (yield gitTag(context.tagPrefix + context.version.new, tagMessage)) {
      shouldPush = true;
    } else {
      context.logger.warn("Git tag already exists");
    }
    if (!shouldPush || !(yield gitPush(context, context.branch.name, true))) {
      context.logger.warn("Nothing to push");
    }
  });
}
export {
  init_default as init,
  utils_exports as utils,
  version_default as version
};
