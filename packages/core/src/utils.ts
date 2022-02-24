import * as path from "path";
import * as exec from "@actions/exec";
import { cosmiconfig } from "cosmiconfig";
import { IContext, IPluginsLoaded, IProtectedBranch } from "./doc";
import { Inputs } from "./inputs";
import { Logger } from "./logger";

export async function buildContext(): Promise<IContext | undefined> {
    const envCi = await loadCiEnv();
    const config = await cosmiconfig("release").search(Inputs.configDir);
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

    const tagPrefix = config.config.tagPrefix || "v";
    const versionInfo = await buildVersionInfo(branches[branchIndex], tagPrefix);

    return {
        branch: branches[branchIndex],
        changedFiles: [],
        ci: envCi,
        dryRun: Inputs.dryRun,
        env: process.env as any,
        logger: new Logger(),
        plugins: pluginConfig,
        releasedPackages: {},
        tagPrefix,
        version: versionInfo
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
    return cmdOutput.exitCode === 0 && cmdOutput.stdout.trim() || undefined;
}

export async function loadPlugins(context: IContext): Promise<IPluginsLoaded> {
    const pluginsLoaded: IPluginsLoaded = {};
    for (const pluginName in context.plugins) {
        let pluginPath = pluginName;
        if (pluginName.startsWith("@octorelease/") && path.basename(__dirname) === "dist") {
            pluginPath = pluginName.replace("@octorelease", __dirname);
        } else if (!pluginName.startsWith("./")) {
            pluginPath = `./node_modules/${pluginName}`;
        }
        pluginsLoaded[pluginName] = require(path.resolve(pluginPath));
    }
    return pluginsLoaded;
}

export async function verifyConditions(context: IContext): Promise<void> {
    context.version.new = Inputs.newVersion || context.version.new;
    if (context.version.prerelease != null) {
        context.version.new = `${context.version.new.split("-")[0]}-${context.version.prerelease}`;
    }

    const semverDiff = require("semver").diff(context.version.old, context.version.new);
    if ((semverDiff === "major" && (context.branch.level === "minor" || context.branch.level === "patch")) ||
            (semverDiff === "minor" && context.branch.level === "patch")) {
        throw new Error(`Protected branch ${context.branch.name} does not allow ${semverDiff} version changes`);
    }
}

async function buildVersionInfo(branch: IProtectedBranch, tagPrefix: string): Promise<any> {
    const cmdOutput = await exec.getExecOutput("git", ["describe", "--abbrev=0"], { ignoreReturnCode: true });
    const oldVersion = cmdOutput.exitCode === 0 && cmdOutput.stdout.trim().slice(tagPrefix.length) || "0.0.0";

    let prerelease: string | undefined = undefined;
    if (branch.prerelease) {
        const prereleaseName = (typeof branch.prerelease === "string") ? branch.prerelease : branch.name;
        const timestamp = (new Date()).toISOString().replace(/\D/g, "").slice(0, 12);
        prerelease = `${prereleaseName}.${timestamp}`;
    }

    return { old: oldVersion, new: oldVersion, prerelease };
}

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
