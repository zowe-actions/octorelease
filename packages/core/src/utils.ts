import * as path from "path";
import * as exec from "@actions/exec";
import { cosmiconfig } from "cosmiconfig";
import { IContext, IPluginsLoaded } from "./doc";
import { Inputs } from "./inputs";
import { Logger } from "./logger";

export async function buildContext(): Promise<IContext | undefined> {
    const envCi = await loadCiEnv();
    const config = await cosmiconfig("release").search();
    if (config == null || config.isEmpty) {
        throw new Error("Failed to load config because file does not exist or is empty");
    }

    const micromatch = require("micromatch");
    const branches = config.config.branches.map((branch: any) => typeof branch === "string" ? { name: branch } : branch);
    const branchIndex = branches.findIndex((branch: any) => micromatch.isMatch(envCi.branch, branch.name));
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

    const cmdOutput = await exec.getExecOutput("git", ["describe", "--abbrev=0"], { ignoreReturnCode: true });
    const oldVersion = cmdOutput.stdout.trim().slice(1) || "0.0.0";

    return {
        branch: branches[branchIndex],
        changedFiles: [],
        ci: envCi,
        dryRun: Inputs.dryRun,
        env: process.env as any,
        logger: new Logger(),
        plugins: pluginConfig,
        releasedPackages: {},
        version: { old: oldVersion }
    };
}

export async function dryRunTask<T>(context: IContext, description: string, task: () => Promise<T>): Promise<T | undefined> {
    if (context.dryRun) {
        context.logger.info(`Skipping "${description}"`);
    } else {
        return task();
    }
}

export async function getLastCommitMessage(): Promise<string | undefined> {
    const cmdOutput = await exec.getExecOutput("git", ["log", "-1", "--pretty=format:%s"], { ignoreReturnCode: true });
    return cmdOutput.stdout.trim() || undefined;
}

export async function loadCiEnv(): Promise<any> {
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
        envCi.slug = cmdOutput.stdout.trim().slice(0, -4).split("/").slice(-2).join("/");
    }
    const [ owner, repo ] = envCi.slug.split("/");

    return { ...envCi, repo: { owner, repo } };
}

export async function loadPlugins(context: IContext): Promise<IPluginsLoaded> {
    const pluginsLoaded: IPluginsLoaded = {};
    for (const pluginName in context.plugins) {
        let pluginPath = pluginName;
        if (pluginName.startsWith("@octorelease/")) {
            pluginPath = pluginName.replace("@octorelease", __dirname);
        } else if (!pluginName.startsWith("./")) {
            pluginPath = `./node_modules/${pluginName}`;
        }
        pluginsLoaded[pluginName] = require(path.resolve(pluginPath));
    }
    return pluginsLoaded;
}

export async function verifyConditions(context: IContext): Promise<void> {
    context.version.new = context.version.new || context.version.old;
    const semverDiff = require("semver").diff(context.version.old, context.version.new);

    if ((semverDiff === "major" && (context.branch.level === "minor" || context.branch.level === "patch")) ||
            (semverDiff === "minor" && context.branch.level === "patch")) {
        throw new Error(`Protected branch ${context.branch.name} does not allow ${semverDiff} version changes`);
    }

    if (context.branch.prerelease && context.version.new != null) {
        const prereleaseName = (typeof context.branch.prerelease === "string") ? context.branch.prerelease : context.branch.name;
        const timestamp = (new Date()).toISOString().replace(/\D/g, "").slice(0, 12);
        context.version.new = `${context.version.new.split("-")[0]}-${prereleaseName}.${timestamp}`;
    }
}
