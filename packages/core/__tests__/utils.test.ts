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

import { IContext, SemverDiffLevels } from "../src/doc";
import { verifyConditions } from "../src/utils";

describe("Utility functions", () => {
    const oldVersion = "1.0.0";

    it("verifyConditions should append prerelease string to new version", async () => {
        const context: Partial<IContext> = {
            branch: { name: "main" },
            version: {
                old: oldVersion,
                new: oldVersion,
                overrides: {},
                prerelease: "next"
            }
        };
        await verifyConditions(context as IContext);
        expect((context.version as any).new).toEqual(`${oldVersion}-next`);
    });

    it.each(SemverDiffLevels.slice(1))("verifyConditions should allow semver bumps when level is %s", async (level) => {
        const context: Partial<IContext> = {
            branch: {
                name: "main",
                level
            },
            version: {
                old: oldVersion,
                new: require("semver").inc(oldVersion, level),
                overrides: {}
            }
        };
        await expect(verifyConditions(context as IContext)).resolves.not.toThrow();
    });

    it.each(SemverDiffLevels.slice(0, -1))(
        "verifyConditions should block semver bumps when level is %s", async (level) => {
        const badLevel = SemverDiffLevels[SemverDiffLevels.indexOf(level) + 1];
        const context: Partial<IContext> = {
            branch: {
                name: "main",
                level
            },
            version: {
                old: oldVersion,
                new: require("semver").inc(oldVersion, badLevel),
                overrides: {}
            }
        };
        await expect(verifyConditions(context as IContext)).rejects.toThrow(
            `Protected branch main does not allow ${badLevel} version changes`);
    });
});
