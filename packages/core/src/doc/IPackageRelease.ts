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

import type { IVersionInfo } from "./IVersionInfo";

/** A package selected for an independent release. */
export interface IPackageRelease {
    name: string;
    /** Package directory relative to the repository root. */
    directory: string;
    version: Omit<IVersionInfo, "overrides">;
    /** Absent for timestamped snapshots, which do not create Git tags. */
    tagName?: string;
    releaseNotes?: string;
}
