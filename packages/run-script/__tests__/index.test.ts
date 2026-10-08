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

import * as fs from "node:fs";
import * as path from "node:path";
import { loadScript } from "../src/loader";

describe("Run Script action", () => {
    const scriptNames = fs.readdirSync(__dirname + "/../src/scripts").map((s) => s.slice(0, s.lastIndexOf(".")));

    for (const scriptName of scriptNames) {
        it("should load script " + scriptName, async () => {
            expect(typeof (await loadScript(scriptName))).toBe("function");
        });
    }

    it("should reject an unknown script name", async () => {
        await expect(loadScript("doesNotExist")).rejects.toThrow("Could not find script to run: doesNotExist");
    });

    it("should load and run a custom script from absolute path", async () => {
        const fixturePath = path.join(__dirname, "fixtures/customScript");
        const fakeContext = { logger: { debug: vi.fn(), info: vi.fn() }, version: { new: "1.0.0" } } as any;
        const fakeApi = { npm: {} } as any;
        const fakeEvent = { ref: "main" } as any;
        const script = await loadScript(fixturePath);
        await expect(script(fakeContext, fakeApi, fakeEvent)).resolves.toBeUndefined();
    });

    it("should load and run a custom script from relative path prefixed with './'", async () => {
        const fixturePath = path.join(__dirname, "fixtures/customScript");
        const relativePath = "./" + path.relative(process.cwd(), fixturePath).replace(/\\/g, "/");
        const fakeContext = { logger: { debug: vi.fn(), info: vi.fn() }, version: { new: "1.0.0" } } as any;
        const fakeApi = { npm: {} } as any;
        const fakeEvent = { ref: "main" } as any;
        const script = await loadScript(relativePath);
        await expect(script(fakeContext, fakeApi, fakeEvent)).resolves.toBeUndefined();
    });
});
