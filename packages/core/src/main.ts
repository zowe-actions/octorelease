import * as path from "path";
import * as core from "@actions/core";
import * as actions from "./actions";
import * as utils from "./utils";

async function run(): Promise<void> {
    try {
        if (core.getInput("working-directory")) {
            process.chdir(path.resolve(core.getInput("working-directory")));
        }
        const context = await utils.buildContext();

        if (context == null) {
            core.info("Current branch is not a release branch, exiting now");
            process.exit();
        } else if ((await utils.getLastCommitMessage(context))?.includes("[ci skip]")) {
            core.info("Commit message contains CI skip phrase, exiting now");
            process.exit();
        }

        const pluginsLoaded = await utils.loadPlugins(context);
        try {
            await actions.init(context, pluginsLoaded);
            await utils.verifyConditions(context);
            await actions.version(context, pluginsLoaded);
            await actions.publish(context, pluginsLoaded);
            await actions.success(context, pluginsLoaded);
        } catch (error) {
            context.failError = error;
            await actions.fail(context, pluginsLoaded);
            throw error;
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
