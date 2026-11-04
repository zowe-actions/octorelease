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

import type { IPluginConfig } from "./config";

/** Internal state shared across stages for one plugin configuration. */
export class LernaState {
    private static readonly instances = new WeakMap<IPluginConfig, LernaState>();

    isLernaJsonTemp = false;
    // Resolved packages in dependency order; context.workspaces contains paths/globs.
    workspacePackages?: { name: string; location: string }[];

    private constructor() {}

    static get(config: IPluginConfig): LernaState {
        let state = LernaState.instances.get(config);
        if (state == null) {
            state = new LernaState();
            LernaState.instances.set(config, state);
        }
        return state;
    }
}
