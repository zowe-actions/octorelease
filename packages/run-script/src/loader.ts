/**
 * Copyright 2020-202X Zowe Actions Contributors
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

import * as path from "node:path";
import type { IContext } from "@octorelease/core";
import type { IPluginApi } from "./plugins";

type ScriptModule = { default: (context: IContext, api: IPluginApi, event: object) => Promise<void> };

const SCRIPTS: Record<string, () => Promise<ScriptModule>> = {
    npmUpdate: () => import("./scripts/npmUpdate"),
    prepareRelease: () => import("./scripts/prepareRelease"),
};

/**
 * Load a script by name. Names matching a built-in script (e.g. "npmUpdate")
 * are loaded from ./scripts. Any other name must start with "./" or "../" to
 * make it explicit that it refers to a custom script path, resolved relative
 * to the current working directory.
 */
export async function loadScript(scriptName: string): Promise<ScriptModule["default"]> {
    if (path.isAbsolute(scriptName) || scriptName.startsWith(".")) {
        const scriptModule = (await import(path.resolve(process.cwd(), scriptName))) as ScriptModule;
        return scriptModule.default;
    }
    if (!Object.keys(SCRIPTS).includes(scriptName)) {
        throw new Error(`Could not find script to run: ${scriptName}`);
    }
    return (await SCRIPTS[scriptName]()).default;
}
