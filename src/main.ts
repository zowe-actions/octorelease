import * as core from "@actions/core";
import * as utils from "./utils/core";
import { Publish } from "./publish";
import { Version } from "./version";

async function run(): Promise<void> {
    try {
        const context = await utils.buildContext();

        if (context == null) {
            core.info("Current branch is not a release branch, exiting now");
            process.exit();
        } else if (context.eventData?.head_commit?.message.indexOf("[ci skip]") !== -1) {
            core.info("Commit message contains CI skip phrase, exiting now");
            process.exit();
        }

        const [currentVersion, newVersion] = await Version.version(context);
        if (newVersion !== currentVersion) {
            core.setOutput("new-version", newVersion);
        }

        await Publish.publish(context, newVersion);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
