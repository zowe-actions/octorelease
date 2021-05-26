console.log("a");
import * as core from "@actions/core";
console.log("b");
import * as utils from "./utils/core";
console.log("c");
import { Publish } from "./publish";
console.log("d");
import { Version } from "./version";
console.log("e");

async function run(): Promise<void> {
    console.log("f");
    try {
        console.log("g");
        const context = await utils.buildContext();
        console.log("z");

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
