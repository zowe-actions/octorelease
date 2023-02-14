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

import * as path from "path";
import * as core from "@actions/core";

/**
 * Class for accessing GitHub action inputs.
 * If Octorelease is used outside of GitHub Actions, these inputs can be
 * supplied as environment variables. For example, the "dry-run" input is
 * associated with the "INPUT_DRY-RUN" environment variable.
 */
export class Inputs {
    private static readonly rootDir = process.cwd();

    /**
     * Specify whether to detect [ci skip] in last commit message
     */
    public static get ciSkip(): boolean {
        try {
            return core.getBooleanInput("ci-skip");
        } catch (error) {
            if (error instanceof TypeError) {
                return true;
            }
            throw error;
        }
    }

    /**
     * Custom directory to search for release configuration.
     */
    public static get configDir(): string | undefined {
        const input = core.getInput("config-dir");
        return input ? path.resolve(this.rootDir, input) : undefined;
    }

    /**
     * Don't make any changes but report what would have been done.
     */
    public static get dryRun(): boolean {
        try {
            return core.getBooleanInput("dry-run");
        } catch (error) {
            if (error instanceof TypeError) {
                return false;
            }
            throw error;
        }
    }

    /**
     * New version number that should be released.
     */
    public static get newVersion(): string | undefined {
        return core.getInput("new-version") || undefined;
    }

    /**
     * Comma-separated list of stages that should be skipped.
     */
    public static get skipStages(): string[] {
        const input = core.getInput("skip-stages");
        return input ? input.split(",").map(s => s.trim()) : [];
    }

    /**
     * Custom working directory to use instead of the project root.
     */
    public static get workingDir(): string | undefined {
        return core.getInput("working-dir") || undefined;
    }
}
