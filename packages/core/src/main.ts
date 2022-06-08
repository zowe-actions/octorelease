#!/usr/bin/env node

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

import * as path from "path";
import * as core from "@actions/core";
import delay from "delay";
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
        }

        const pluginsLoaded = await utils.loadPlugins(context);
        try {
            await stages.init(context, pluginsLoaded);
            await utils.verifyConditions(context);
            await stages.version(context, pluginsLoaded);
            await stages.publish(context, pluginsLoaded);
            await stages.success(context, pluginsLoaded);
        } catch (error) {
            await delay(1000);  // Test to fix truncated output
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
