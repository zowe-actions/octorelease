import * as core from "@actions/core";
import * as github from "@actions/github";
import * as utils from "./utils/core";

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

        for (const action of core.getInput("actions").split(",")) {
            const actionHandler = require("./" + action.trim());
            await actionHandler(context);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
