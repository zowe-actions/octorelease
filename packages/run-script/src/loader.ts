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

import { IContext } from "@octorelease/core";

const SCRIPTS: { [key: string]: any } = {
    npmUpdate: require("../scripts/npmUpdate"),
    prepareRelease: require("../scripts/prepareRelease"),
    sonarConfig: require("../scripts/sonarConfig")
};

// List of scripts that should only run in release branches
export const RELEASE_SCRIPTS: string[] = ["npmUpdate"];

export function loadScript(scriptName: string): (context: IContext) => Promise<void> {
    if (!Object.keys(SCRIPTS).includes(scriptName)) {
        throw new Error(`Could not find script to run: ${scriptName}`);
    }
    return SCRIPTS[scriptName].default;
}
