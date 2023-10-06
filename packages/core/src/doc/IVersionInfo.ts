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

/**
 * Info about project version
 */
export interface IVersionInfo {
    /**
     * Old version found in Git history
     */
    old: string;

    /**
     * New version to be released
     */
    new: string;

    /**
     * Prerelease string if this is a prerelease branch
     */
    prerelease?: string;

    /**
     * Version overrides for directories in workspace
     */
    overrides: Record<string, Omit<IVersionInfo, "overrides">>;
}
