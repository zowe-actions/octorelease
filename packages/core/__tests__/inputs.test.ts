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

import { Inputs } from "../src/inputs";

describe("Inputs class", () => {
    let oldProcessEnv: any;

    beforeAll(() => {
        oldProcessEnv = process.env;
    });

    afterAll(() => {
        process.env = oldProcessEnv;
    });

    it("should load dry run setting from environment variable", () => {
        process.env["INPUT_DRY-RUN"] = "false";
        expect(Inputs.dryRun).toBe(false);
        process.env["INPUT_DRY-RUN"] = "true";
        expect(Inputs.dryRun).toBe(true);
    });

    it("should load skip stages setting from environment variable", () => {
        process.env["INPUT_SKIP-STAGES"] = "";
        expect(Inputs.skipStages).toEqual([]);
        process.env["INPUT_SKIP-STAGES"] = "version, publish";
        expect(Inputs.skipStages).toEqual(["version", "publish"]);
    });
});
