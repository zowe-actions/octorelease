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

import { IContext } from "@octorelease/core";
import { IPluginApi } from "../../src/plugins";

/**
 * Sample custom script for the "script" action's "script" input, e.g.:
 *   - uses: zowe-actions/octorelease/script@v1
 *     with:
 *       script: ./ci/mycustomscript.js
 *
 * Custom scripts can be plain JavaScript -- this one is TypeScript only
 * because it lives in this repo. They receive Octorelease's hydrated
 * context, plus lazy access to its built-in plugins.
 */
export default async function (context: IContext, api: IPluginApi): Promise<void> {
    // context has release info like context.version, context.branch, context.env
    // api exposes Octorelease's built-in plugins, e.g. api.git.utils.gitAdd(...)
    context.logger.info(`Releasing version ${context.version.new}`);
}
