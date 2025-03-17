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
import { IPluginConfig } from "./config";

export default async function (context: IContext, _config: IPluginConfig): Promise<void> {
    if (context.env.TWINE_USERNAME == null) {
        throw new Error("Required environment variable TWINE_USERNAME is undefined");
    }

    if (context.env.TWINE_PASSWORD == null) {
        throw new Error("Required environment variable TWINE_PASSWORD is undefined");
    }

    if (require("which").sync("twine", { nothrow: true }) == null) {
        throw new Error("Could not find twine on PATH");
    }
}
