/**
 * Copyright 2020-2023 Zowe Actions Contributors
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

import * as exec from "@actions/exec";
import { IContext } from "@octorelease/core";

export async function twineUpload(context: IContext, distPath?: string): Promise<void> {
    const cmdArgs = ["upload", `${distPath || "dist"}/*`];
    if (context.dryRun) {
        cmdArgs.splice(1, 0, "-r", "testpypi");
    }
    await exec.exec("twine", cmdArgs);
}