/**
 * Copyright 2022 Octorelease Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as url from "url";
import * as exec from "@actions/exec";
import { IContext } from "@octorelease/core";

export async function gitAdd(...files: string[]): Promise<void> {
    await exec.exec("git", ["add", ...files]);
}

export async function gitCommit(message: string, amend?: boolean): Promise<boolean> {
    // Check if there is anything to commit
    if (!amend) {
        const cmdOutput = await exec.getExecOutput("git", ["diff", "--name-only", "--cached"]);
        if (cmdOutput.stdout.trim().length == 0) {
            return false;
        }
    }

    const cmdArgs = ["commit", "-s", "-m", message.includes("[ci skip]") ? message : `${message} [ci skip]`];
    if (amend) {
        cmdArgs.push("--amend");
    }
    await exec.exec("git", cmdArgs);
    return true;
}

export async function gitConfig(context: IContext): Promise<void> {
    await exec.exec("git", ["config", "--global", "user.name", context.env.GIT_COMMITTER_NAME]);
    await exec.exec("git", ["config", "--global", "user.email", context.env.GIT_COMMITTER_EMAIL]);

    if (context.env.GIT_CREDENTIALS != null) {
        await exec.exec("git", ["config", "--global", "credential.helper", "store"]);
        const cmdOutput = await exec.getExecOutput("git", ["config", "--get", "remote.origin.url"]);
        const gitUrl = new url.URL(cmdOutput.stdout);
        fs.appendFileSync(path.join(os.homedir(), ".git-credentials"),
            `${gitUrl.protocol}//${context.env.GIT_CREDENTIALS}@${gitUrl.host}`);
    }

    await exec.exec("git", ["ls-remote", "--heads", "origin", context.branch.name]);  // Validate Git credentials
}

export async function gitPush(context: IContext, branch: string, tags?: boolean): Promise<boolean> {
    // Check if there is anything to push
    if (!tags) {
        const cmdOutput = await exec.getExecOutput("git", ["cherry"]);
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
    await exec.exec("git", cmdArgs);
    return true;
}

export async function gitTag(tagName: string, message?: string): Promise<boolean> {
    // Check if tag already exists
    const cmdOutput = await exec.getExecOutput("git", ["tag", "-l", tagName]);
    if (cmdOutput.stdout.trim().length > 0) {
        return false;
    }

    const cmdArgs = ["tag", tagName];
    if (message != null) {
        cmdArgs.push("-a", "-m", message);
    }
    await exec.exec("git", cmdArgs);
    return true;
}
