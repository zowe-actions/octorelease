import * as core from "@actions/core";
import * as github from "@actions/github";
import * as actions from "./actions";
import * as utils from "./utils";

async function run(): Promise<void> {
    try {
        const context = await utils.buildContext();

        if (context == null) {
            core.info("Current branch is not a release branch, exiting now");
            process.exit();
        } else if (github.context.payload.head_commit?.message.indexOf("[ci skip]") !== -1) {
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
