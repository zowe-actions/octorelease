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
import type { IContext } from "@octorelease/core";
import { DEFAULT_NPM_REGISTRY, utils as npmUtils } from "@octorelease/npm";
import init from "../src/init";

vi.mock("node:fs", { spy: true });
vi.mock("@octorelease/npm", () => ({
    DEFAULT_NPM_REGISTRY: "https://registry.npmjs.org/",
    utils: { npmAuthenticate: vi.fn() },
}));
vi.mock("../src/utils", () => ({
    lernaList: vi.fn(async () => [{ name: "example", location: "packages/example" }]),
}));

describe("Lerna initialization", () => {
    let context: IContext;

    beforeEach(() => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(fs.readFileSync).mockReturnValue('{"version":"1.2.3","workspaces":["packages/*"]}');
        context = {
            env: {
                GITHUB_ACTIONS: "true",
                ACTIONS_ID_TOKEN_REQUEST_URL: "https://example.com/oidc",
                ACTIONS_ID_TOKEN_REQUEST_TOKEN: "request-token",
            },
            branch: { name: "main" },
            version: { old: "1.0.0", new: "1.0.0", overrides: {} },
        } as unknown as IContext;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("uses the shared authentication helper without requiring an NPM_TOKEN", async () => {
        await init(context, {});
        expect(npmUtils.npmAuthenticate).toHaveBeenCalledExactlyOnceWith(context, DEFAULT_NPM_REGISTRY);
        expect(context.workspaces).toEqual(["packages/*"]);
        expect(context.version.new).toBe("1.2.3");
    });

    it("passes the configured publishing registry to authentication", async () => {
        const registry = "https://npm.example.com/";
        await init(context, { publishRegistry: registry });
        expect(npmUtils.npmAuthenticate).toHaveBeenCalledExactlyOnceWith(context, registry);
    });

    it("skips authentication when publishing is disabled", async () => {
        await init(context, { npmPublish: false });
        expect(npmUtils.npmAuthenticate).not.toHaveBeenCalled();
    });
});
