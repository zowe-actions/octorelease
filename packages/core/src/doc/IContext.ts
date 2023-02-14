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

import { KnownCiEnv } from "env-ci";
import { Logger } from "../logger";
import { IProtectedBranch } from "./IProtectedBranch";
import { IReleasedPackage } from "./IReleasedPackage";
import { IVersionInfo } from "./IVersionInfo";

/**
 * Global context object for Octorelease
 */
export interface IContext {
    /**
     * Properties for current Git branch
     * @example { name: "master", level: "minor" }
     */
    branch: IProtectedBranch;

    /**
     * List of changed files to stage
     * @example ["package.json", "package-lock.json"]
     */
    changedFiles: string[];

    /**
     * Properties for current CI environment
     * @example { branch: "master", commit: "deadbeef", repo: { owner: "octorelease", repo: "octorelease" } }
     */
    ci: KnownCiEnv & {
        repo: {
            owner: string;
            repo: string;
        };
    };

    /**
     * If true, don't make any changes but report what would have been done
     */
    dryRun: boolean;

    /**
     * Environment variables
     */
    env: Record<string, string>;

    /**
     * Error object defined for "fail" stage
     */
    failError?: Error;

    /**
     * Logger for writing to console
     */
    logger: Logger;

    /**
     * Key-value pairs of plugin names and configuration objects
     * @example { "@octorelease/changelog": [], "@octorelease/github": [ { assets: "*.tgz" } ] }
     */
    plugins: { [key: string]: Record<string, any>[] };

    /**
     * Key-value pairs of release types and released package info
     * @example { npm: [{ name: "@octorelease/core" }] }
     */
    releasedPackages: { [key: string]: IReleasedPackage[] };

    /**
     * Multi-line string containing changelog
     */
    releaseNotes?: string;

    /**
     * Absolute path of project root directory
     */
    rootDir: string;

    /**
     * Git tag prefix that precedes version number (default is "v")
     */
    tagPrefix: string;

    /**
     * Version info including old and new project version
     * @example { old: "1.0.0", new: "1.0.1" }
     */
    version: IVersionInfo;

    /**
     * Subpackage paths or globs for monorepo
     * @example ["packages/*"]
     */
    workspaces?: string[];
}
