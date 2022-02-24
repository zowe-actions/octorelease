#!/usr/bin/env node
import * as path from "path";
import * as core from "@actions/core";
import { Inputs } from "./inputs";
import * as stages from "./stages";
import * as utils from "./utils";

async function run(): Promise<void> {
    try {
        if (Inputs.workingDir != null) {
            process.chdir(path.resolve(Inputs.workingDir));
        }

        const context = await utils.buildContext();
        if (context == null) {
            core.info("Current branch is not a release branch, exiting now");
            process.exit();
        } else if ((await utils.getLastCommitMessage())?.includes("[ci skip]")) {
            core.info("Commit message contains CI skip phrase, exiting now");
            process.exit();
        }

        const pluginsLoaded = await utils.loadPlugins(context);
        try {
            await stages.init(context, pluginsLoaded);
            await utils.verifyConditions(context);
            await stages.version(context, pluginsLoaded);
            await stages.publish(context, pluginsLoaded);
            await stages.success(context, pluginsLoaded);
        } catch (error) {
            if (error instanceof Error) {
                context.failError = error;
                await stages.fail(context, pluginsLoaded);
            }
            throw error;
        }
    } catch (error) {
        if (error instanceof Error) {
            core.error(error.stack || error.message);
        }
        core.setFailed(error as Error);
    }
}

run();
