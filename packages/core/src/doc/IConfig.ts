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

import { IProtectedBranch } from "./IProtectedBranch";

/**
 * Union type for branch configuration. Can be string specifying branch name
 * or object containing branch config.
 */
export type BranchConfig = string | IProtectedBranch;

/**
 * Union type for plugin configuration. Can be string specifying plugin name
 * or array containing plugin name and one or more configuration objects.
 */
export type PluginConfig = string | [string, ...Record<string, any>[]];

/**
 * Configuration object loaded from release config file
 */
export interface IConfig {
    /**
     * Array of protected branch configurations
     */
    branches: BranchConfig[];

    /**
     * Array of Octorelease plugin configurations
     */
    plugins: PluginConfig[];

    /**
     * Git tag prefix that precedes version number (default is "v")
     */
    tagPrefix: string;
}
