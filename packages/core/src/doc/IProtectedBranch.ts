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

/**
 * Protected branch configuration object
 */
export interface IProtectedBranch {
    /**
     * Branch name
     */
    name: string;

    /**
     * Release channel (e.g., NPM tag)
     */
    channel?: string;

    /**
     * Maximum semver bump level allowed
     */
    level?: "major" | "minor" | "patch";

    /**
     * Prerelease name (defaults to branch name if `true`)
     */
    prerelease?: boolean | string;
}
