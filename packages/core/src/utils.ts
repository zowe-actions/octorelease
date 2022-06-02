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
import * as path from "path";
import * as exec from "@actions/exec";
import { cosmiconfig } from "cosmiconfig";
import { IContext, IPluginsLoaded, IProtectedBranch, IVersionInfo } from "./doc";
import { Inputs } from "./inputs";
import { Logger } from "./logger";

/**
 * Build global context object that is passed to all plugin handlers.
 * @returns Global context object for Octorelease
 */
export async function buildContext(opts?: { branch?: string }): Promise<IContext | undefined> {
    const envCi = await loadCiEnv();
    const config = await cosmiconfig("release").search(Inputs.configDir);
    if (config == null || config.isEmpty) {
        throw new Error("Failed to load config because file does not exist or is empty");
    }

    const micromatch = require("micromatch");
    const branches = config.config.branches.map((branch: any) => typeof branch === "string" ?
        { name: branch } : branch);
    const branchIndex = branches.findIndex((branch: any) =>
        micromatch.isMatch(opts?.branch || envCi.branch, branch.name));
    if (branchIndex == -1) {
        return;
    } else if (branchIndex > 0 && branches[branchIndex].channel == null) {
        branches[branchIndex].channel = branches[branchIndex].name;
    }

    const pluginConfig: Record<string, Record<string, any>> = {};
    for (const pc of (config.config.plugins || [])) {
        if (typeof pc === "string") {
            pluginConfig[pc] = {};
        } else {
            pluginConfig[pc[0]] = pc[1];
        }
    }

    const tagPrefix = config.config.tagPrefix || "v";
    const versionInfo = await buildVersionInfo(branches[branchIndex], tagPrefix);

    return {
        branch: { ...branches[branchIndex], name: envCi.branch },
        changedFiles: [],
        ci: envCi,
        dryRun: Inputs.dryRun,
        env: process.env as any,
        getReleaseNotes: async () => undefined,
        logger: new Logger(),
        plugins: pluginConfig,
        releasedPackages: {},
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
        pluginsLoaded[pluginName] = require(path.resolve(pluginPath));
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
    context.version.new = Inputs.newVersion || context.version.new;
    if (context.version.prerelease != null) {
        context.version.new = `${context.version.new.split("-")[0]}-${context.version.prerelease}`;
    }

    const semverDiff = require("semver").diff(context.version.old.split("-")[0], context.version.new.split("-")[0]);
    if ((semverDiff === "major" && (context.branch.level === "minor" || context.branch.level === "patch")) ||
            (semverDiff === "minor" && context.branch.level === "patch")) {
        throw new Error(`Protected branch ${context.branch.name} does not allow ${semverDiff} version changes`);
    }

    await context.getReleaseNotes();
}

/**
 * Find old version in Git history and generate prerelease string if needed.
 * @param branch Protected branch info
 * @param tagPrefix Git tag prefix that precedes version number
 * @returns Version info for the `context.version` property
 */
async function buildVersionInfo(branch: IProtectedBranch, tagPrefix: string): Promise<IVersionInfo> {
    const cmdOutput = await exec.getExecOutput("git", ["describe", "--abbrev=0", `--match=${tagPrefix}*`],
        { ignoreReturnCode: true });
    const oldVersion = cmdOutput.exitCode === 0 && cmdOutput.stdout.trim().slice(tagPrefix.length) || "0.0.0";

    let prerelease: string | undefined = undefined;
    if (branch.prerelease) {
        const prereleaseName = (typeof branch.prerelease === "string") ? branch.prerelease : branch.name;
        const timestamp = (new Date()).toISOString().replace(/\D/g, "").slice(0, 12);
        prerelease = `${prereleaseName}.${timestamp}`;
    }

    return { old: oldVersion, new: oldVersion, prerelease };
}

/**
 * Load CI properties like branch name, commit SHA, and repository slug.
 * @returns CI environment for the `context.ci` property
 */
async function loadCiEnv(): Promise<any> {
    const envCi = require("env-ci")();
    if (envCi.service == null) {
        throw new Error(`Unsupported CI service detected: ${envCi.service}`);
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
    const [ owner, repo ] = envCi.slug.split("/");

    return { ...envCi, repo: { owner, repo } };
}
