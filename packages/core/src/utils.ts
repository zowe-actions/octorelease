import * as path from "path";
import * as exec from "@actions/exec";
import * as github from "@actions/github";
import { cosmiconfig } from "cosmiconfig";
import { IContext, IPluginsLoaded } from "./doc";
import { Inputs } from "./inputs";
import { Logger } from "./logger";

export async function buildContext(): Promise<IContext | undefined> {
    const config = await cosmiconfig("release").search();
    if (config == null || config.isEmpty) {
        throw new Error("Failed to load config because file does not exist or is empty");
    }

    const branchName = github.context.payload.pull_request?.base.ref || github.context.ref.replace(/^refs\/heads\//, "");
    const micromatch = require("micromatch");
    const branches = config.config.branches.map((branch: any) => typeof branch === "string" ? { name: branch } : branch);
    const branchIndex = branches.findIndex((branch: any) => micromatch.isMatch(branchName, branch.name));
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

    return {
        branch: branches[branchIndex],
        changedFiles: [],
        dryRun: Inputs.dryRun,
        env: process.env as any,
        logger: new Logger(),
        plugins: pluginConfig,
        releasedPackages: {},
        version: {}
    };
}

export async function dryRunTask<T>(context: IContext, description: string, task: () => Promise<T>): Promise<T | undefined> {
    if (context.dryRun) {
        context.logger.info(`Skipping "${description}"`);
    } else {
        return task();
    }
}

export async function loadPlugins(context: IContext): Promise<IPluginsLoaded> {
    const pluginsLoaded: IPluginsLoaded = {};
    for (const pluginName in context.plugins) {
        const pluginPath = (pluginName.startsWith("./") ? "" : "./node_modules/") + pluginName;
        pluginsLoaded[pluginName] = require(path.resolve(pluginPath));
    }
    return pluginsLoaded;
}

export async function verifyConditions(context: IContext): Promise<void> {
    if (context.version.old == null) {
        const cmdOutput = await exec.getExecOutput("git", ["describe", "--abbrev=0"], { ignoreReturnCode: true });
        context.version.old = cmdOutput.stdout.trim().slice(1) || "0.0.0";
    }

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
