/**
 * Copyright 2020-202X Zowe Actions Contributors
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
import * as path from "path";
import * as exec from "@actions/exec";
import { cosmiconfig } from "cosmiconfig";
import { IContext, IContextOpts, IPluginsLoaded, IProtectedBranch, IVersionInfo, SemverDiffLevels } from "./doc";
import { Inputs } from "./inputs";
import { Logger } from "./logger";

/**
 * Build global context object that is passed to all plugin handlers.
 * @param opts Options for building the context object
 * @returns Global context object for Octorelease
 */
export async function buildContext(opts?: IContextOpts):
    Promise<IContext | undefined> {
    const envCi = await loadCiEnv();
    const rc = await cosmiconfig("release").search(Inputs.configDir);
    if (rc == null || rc.isEmpty) {
        throw new Error("Failed to load config because file does not exist or is empty");
    }

    const micromatch = require("micromatch");
    const branches = rc.config.branches.map((branch: any) => typeof branch === "string" ?
        { name: branch } : branch);
    const branchIndex = branches.findIndex((branch: any) =>
        micromatch.isMatch(opts?.branch || envCi.branch, branch.name));
    if (branchIndex == -1 && !opts?.force) {
        return;
    }
    const branchInfo = branches[branchIndex] ?? {};
    branchInfo.name = opts?.branch || envCi.branch;
    if (branchIndex > 0 && branchInfo.channel == null) {
        branchInfo.channel = branchInfo.name;
    }

    const pluginConfig: Record<string, Record<string, any>[]> = {};
    for (const pc of (rc.config.plugins || [])) {
        if (typeof pc === "string") {
            pluginConfig[pc] = [{}];
        } else {
            pluginConfig[pc[0]] = pc.slice(1);
        }
    }

    const tagPrefix = rc.config.tagPrefix || "v";
    const versionInfo = await buildVersionInfo(branchInfo, tagPrefix);

    return {
        branch: branchInfo,
        changedFiles: [],
        ci: envCi,
        dryRun: Inputs.dryRun,
        env: process.env as any,
        logger: new Logger(opts?.logPrefix),
        plugins: pluginConfig,
        releasedPackages: {},
        rootDir: process.cwd(),
        tagPrefix,
        version: versionInfo
    };
}

/**
 * In dry run mode skip the task, otherwise run it.
 * @param context Global context object for Octorelease
 * @param description Description to log when task is skipped
 * @param task Callback to execute when not in dry run mode
 */
export async function dryRunTask<T>(context: IContext, description: string, task: () => Promise<T>):
    Promise<T | undefined> {
    if (context.dryRun) {
        context.logger.info(`Skipping "${description}"`);
    } else {
        return task();
    }
}

/**
 * Load plugins listed in config by requiring their modules from disk.
 * If running as a GitHub Action, @octorelease-scoped plugins missing from
 * node_modules are loaded from the "dist" folder where they are bundled.
 * @param context Global context object for Octorelease
 * @returns Key-value pairs of plugin names and loaded modules
 */
export async function loadPlugins(context: IContext): Promise<IPluginsLoaded> {
    const pluginsLoaded: IPluginsLoaded = {};
    for (const pluginName in context.plugins) {
        let pluginPath = pluginName;
        if (!pluginName.startsWith("./")) {
            pluginPath = `./node_modules/${pluginName}`;
        }
        if (pluginName.startsWith("@octorelease/") && !fs.existsSync(pluginPath)) {
            pluginPath = pluginName.replace("@octorelease", __dirname);
        }
        const fullPluginPath = path.resolve(pluginPath);
        pluginsLoaded[pluginName] = require(fullPluginPath);
        Logger.pluginPathMap[pluginName] = require.resolve(fullPluginPath);
    }
    return pluginsLoaded;
}

/**
 * Verify release conditions after plugins have initialized before proceeding.
 * This finalizes the new version by appending a prerelease string if one is
 * defined and failing the build if the version bump is prohibited by protected
 * branch rules.
 * @param context Global context object for Octorelease
 */
export async function verifyConditions(context: IContext): Promise<void> {
    if (Inputs.newVersion != null) {
        context.version.new = Inputs.newVersion;
    } else if (context.version.prerelease) {
        context.version.new = `${context.version.new.split("-")[0]}-${context.version.prerelease}`;
    }

    const semver = require("semver");
    const semverLevel = context.version.old !== "0.0.0" ?
        semver.diff(context.version.old.split("-")[0], context.version.new.split("-")[0]) : null;
    for (const versionInfo of Object.values(context.version.overrides)) {
        versionInfo.new = semverLevel != null ?
            semver.inc(versionInfo.old.split("-")[0], semverLevel) : versionInfo.old.split("-")[0];
        if (versionInfo.prerelease) {
            versionInfo.new = `${versionInfo.new}-${versionInfo.prerelease}`;
        }
    }

    if (semverLevel != null && context.branch.level != null &&
        SemverDiffLevels.indexOf(semverLevel) > SemverDiffLevels.indexOf(context.branch.level)) {
        throw new Error(`Protected branch ${context.branch.name} does not allow ${semverLevel} version changes`);
    }
}

/**
 * Find old version in Git history and generate prerelease string if needed.
 * @param branch Protected branch info
 * @param tagPrefix Git tag prefix that precedes version number
 * @returns Version info for the `context.version` property
 */
async function buildVersionInfo(branch: IProtectedBranch, tagPrefix: string): Promise<IVersionInfo> {
    const cmdOutput = await exec.getExecOutput("git",
        ["describe", "--tags", "--abbrev=0", `--match=${tagPrefix}[0-9]*.[0-9]*.[0-9]*`], { ignoreReturnCode: true });
    const oldVersion = cmdOutput.exitCode === 0 && cmdOutput.stdout.trim().slice(tagPrefix.length) || "0.0.0";

    let prerelease: string | undefined = branch.prerelease === "" ? "" : undefined;
    if (branch.prerelease) {
        const prereleaseName = (typeof branch.prerelease === "string") ? branch.prerelease : branch.channel;
        const timestamp = (new Date()).toISOString().replace(/\D/g, "").slice(0, 12);
        prerelease = `${prereleaseName}.${timestamp}`;
    }

    return { old: oldVersion, new: oldVersion, prerelease, overrides: {} };
}

/**
 * Retrieve most recent Git commit message if there is one.
 * @returns Commit message or undefined if there is no Git history
 */
export async function getLastCommitMessage(context: IContext): Promise<string | undefined> {
    const cmdOutput = await exec.getExecOutput("git",
        ["log", "-1", "--pretty=format:%s", context.ci.commit], { ignoreReturnCode: true });
    return cmdOutput.exitCode === 0 && cmdOutput.stdout.trim() || undefined;
}

/**
 * Load CI properties like branch name, commit SHA, and repository slug.
 * @returns CI environment for the `context.ci` property
 */
async function loadCiEnv(): Promise<any> {
    let envCi = require("env-ci")();
    if (envCi.service == null) {
        throw new Error(`Unsupported CI service detected: ${envCi.service}`);
    }

    if (envCi.isPr) {
        // For PR builds, map `branch` (base) to `baseBranch` and `prBranch` (head) to `branch`
        envCi = { ...envCi, baseBranch: envCi.branch, branch: envCi.prBranch, prBranch: undefined };
    }
    if (envCi.branch == null) {
        const cmdOutput = await exec.getExecOutput("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
        envCi.branch = cmdOutput.stdout.trim();
    }

    if (envCi.commit == null) {
        const cmdOutput = await exec.getExecOutput("git", ["rev-parse", "HEAD"]);
        envCi.commit = cmdOutput.stdout.trim();
    }

    if (envCi.slug == null) {
        const cmdOutput = await exec.getExecOutput("git", ["config", "--get", "remote.origin.url"]);
        envCi.slug = cmdOutput.stdout.trim().replace(/\.git$/, "").split("/").slice(-2).join("/");
    }
    const [owner, repo] = envCi.slug.split("/");

    return { ...envCi, repo: { owner, repo } };
}
