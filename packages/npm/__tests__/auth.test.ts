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
import * as os from "node:os";
import * as path from "node:path";
import * as exec from "@actions/exec";
import type { IContext } from "@octorelease/core";
import { DEFAULT_NPM_REGISTRY } from "../src/config";
import init from "../src/init";
import { npmAuthenticate, npmPublish } from "../src/utils";

vi.mock("@actions/exec", () => ({ exec: vi.fn(), getExecOutput: vi.fn() }));
vi.mock("node:fs", { spy: true });

const githubOidc = {
    GITHUB_ACTIONS: "true",
    ACTIONS_ID_TOKEN_REQUEST_URL: "https://example.com/oidc",
    ACTIONS_ID_TOKEN_REQUEST_TOKEN: "request-token",
};

function buildContext(env: Record<string, string> = {}): IContext {
    return {
        env,
        branch: { name: "main" },
        version: { old: "1.0.0", new: "1.0.0", overrides: {} },
        logger: { info: vi.fn() },
    } as unknown as IContext;
}

describe("NPM authentication", () => {
    beforeEach(() => {
        vi.mocked(fs.appendFileSync).mockImplementation(() => {});
        vi.mocked(exec.getExecOutput).mockResolvedValue({ stdout: "11.21.0\n", stderr: "", exitCode: 0 });
        vi.mocked(exec.exec).mockResolvedValue(0);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it.each([DEFAULT_NPM_REGISTRY, "https://registry.npmjs.org"])(
        "uses GitHub OIDC without writing credentials or calling whoami for %s",
        async (registry) => {
            const context = buildContext(githubOidc);
            await npmAuthenticate(context, registry);

            expect(exec.getExecOutput).toHaveBeenCalledWith("npm", ["--version"]);
            expect(fs.appendFileSync).not.toHaveBeenCalled();
            expect(exec.exec).not.toHaveBeenCalled();
            expect(context.logger.info).toHaveBeenCalledWith(expect.stringContaining("OIDC"));
        },
    );

    it("treats an empty token as absent in an OIDC environment", async () => {
        await npmAuthenticate(buildContext({ ...githubOidc, NPM_TOKEN: "" }), DEFAULT_NPM_REGISTRY);
        expect(fs.appendFileSync).not.toHaveBeenCalled();
        expect(exec.exec).not.toHaveBeenCalled();
    });

    it.each(["GITLAB_CI", "CIRCLECI", "GITHUB_ACTIONS"])("detects NPM_ID_TOKEN on %s", async (provider) => {
        await npmAuthenticate(buildContext({ [provider]: "true", NPM_ID_TOKEN: "id-token" }), DEFAULT_NPM_REGISTRY);
        expect(fs.appendFileSync).not.toHaveBeenCalled();
        expect(exec.exec).not.toHaveBeenCalled();
    });

    it("retains token authentication when a token is supplied with OIDC available", async () => {
        await npmAuthenticate(buildContext({ ...githubOidc, NPM_TOKEN: "npm-token" }), DEFAULT_NPM_REGISTRY);
        expect(fs.appendFileSync).toHaveBeenCalledWith(
            path.join(os.homedir(), ".npmrc"),
            "//registry.npmjs.org/:_authToken=npm-token",
        );
        expect(exec.exec).toHaveBeenCalledWith("npm", ["whoami", "--registry", DEFAULT_NPM_REGISTRY]);
        expect(exec.getExecOutput).not.toHaveBeenCalled();
    });

    it("retains legacy authentication when legacy credentials are supplied", async () => {
        const context = buildContext({
            ...githubOidc,
            NPM_USERNAME: "publisher",
            NPM_PASSWORD: "password",
            NPM_EMAIL: "publisher@example.com",
        });
        await npmAuthenticate(context, DEFAULT_NPM_REGISTRY);
        expect(fs.appendFileSync).toHaveBeenCalledWith(
            path.join(os.homedir(), ".npmrc"),
            `//registry.npmjs.org/:_auth=${Buffer.from("publisher:password").toString("base64")}\n//registry.npmjs.org/:email=publisher@example.com`,
        );
        expect(exec.exec).toHaveBeenCalledWith("npm", ["whoami", "--registry", DEFAULT_NPM_REGISTRY]);
        expect(exec.getExecOutput).not.toHaveBeenCalled();
    });

    it.each([
        {},
        { NPM_TOKEN: "" },
        { GITHUB_ACTIONS: "true" },
        { GITHUB_ACTIONS: "true", ACTIONS_ID_TOKEN_REQUEST_URL: githubOidc.ACTIONS_ID_TOKEN_REQUEST_URL },
        { GITHUB_ACTIONS: "true", ACTIONS_ID_TOKEN_REQUEST_TOKEN: githubOidc.ACTIONS_ID_TOKEN_REQUEST_TOKEN },
        { NPM_ID_TOKEN: "id-token" },
        {
            ACTIONS_ID_TOKEN_REQUEST_URL: githubOidc.ACTIONS_ID_TOKEN_REQUEST_URL,
            ACTIONS_ID_TOKEN_REQUEST_TOKEN: "token",
        },
    ])("requires credentials when OIDC is unavailable: %j", async (env) => {
        await expect(npmAuthenticate(buildContext(env), DEFAULT_NPM_REGISTRY)).rejects.toThrow(
            "Required environment variable NPM_TOKEN is undefined",
        );
        expect(fs.appendFileSync).not.toHaveBeenCalled();
        expect(exec.getExecOutput).not.toHaveBeenCalled();
        expect(exec.exec).not.toHaveBeenCalled();
    });

    it.each(["https://npm.example.com/", "https://registry.npmjs.org/private/", "http://registry.npmjs.org/"])(
        "requires credentials for registry %s even with OIDC available",
        async (registry) => {
            await expect(npmAuthenticate(buildContext(githubOidc), registry)).rejects.toThrow("NPM_TOKEN");
            expect(fs.appendFileSync).not.toHaveBeenCalled();
            expect(exec.getExecOutput).not.toHaveBeenCalled();
        },
    );

    it("still authenticates custom registries with a token", async () => {
        const registry = "https://npm.example.com/";
        await npmAuthenticate(buildContext({ ...githubOidc, NPM_TOKEN: "npm-token" }), registry);
        expect(fs.appendFileSync).toHaveBeenCalledWith(
            path.join(os.homedir(), ".npmrc"),
            "//npm.example.com/:_authToken=npm-token",
        );
        expect(exec.exec).toHaveBeenCalledWith("npm", ["whoami", "--registry", registry]);
    });

    it("rejects incomplete legacy credentials even with OIDC available", async () => {
        await expect(
            npmAuthenticate(buildContext({ ...githubOidc, NPM_USERNAME: "publisher" }), DEFAULT_NPM_REGISTRY),
        ).rejects.toThrow("Required environment variables NPM_PASSWORD, NPM_EMAIL are undefined");
        expect(fs.appendFileSync).not.toHaveBeenCalled();
        expect(exec.getExecOutput).not.toHaveBeenCalled();
    });

    it.each(["10.9.9", "11.5.1", "11.20.9", "12.0.0", "12.1.9", "11.21.0-beta.1", "12.2.0-rc.1", "invalid"])(
        "rejects npm %s before publishing because it cannot update tags with OIDC",
        async (version) => {
            vi.mocked(exec.getExecOutput).mockResolvedValue({ stdout: version, stderr: "", exitCode: 0 });
            await expect(npmAuthenticate(buildContext(githubOidc), DEFAULT_NPM_REGISTRY)).rejects.toThrow(
                "does not support trusted publishing with dist-tags",
            );
            expect(fs.appendFileSync).not.toHaveBeenCalled();
            expect(exec.exec).not.toHaveBeenCalled();
        },
    );

    it.each(["11.21.0", "11.22.0", "12.2.0", "12.3.0", "12.2.0+build.1"])(
        "accepts npm %s for OIDC",
        async (version) => {
            vi.mocked(exec.getExecOutput).mockResolvedValue({ stdout: version, stderr: "", exitCode: 0 });
            await expect(npmAuthenticate(buildContext(githubOidc), DEFAULT_NPM_REGISTRY)).resolves.toBeUndefined();
        },
    );

    it("initializes the NPM plugin without credentials in an OIDC environment", async () => {
        vi.mocked(fs.readFileSync).mockReturnValue('{"name":"example","version":"1.2.3"}');
        const context = buildContext(githubOidc);
        await init(context, {});
        expect(context.version.new).toBe("1.2.3");
        expect(fs.appendFileSync).not.toHaveBeenCalled();
        expect(exec.exec).not.toHaveBeenCalled();
        expect(exec.getExecOutput).toHaveBeenCalledWith("npm", ["--version"]);
    });

    it("skips authentication when publishing is disabled", async () => {
        vi.mocked(fs.readFileSync).mockReturnValue('{"name":"example","version":"1.2.3"}');
        await init(buildContext(), { npmPublish: false });
        expect(fs.appendFileSync).not.toHaveBeenCalled();
        expect(exec.exec).not.toHaveBeenCalled();
        expect(exec.getExecOutput).not.toHaveBeenCalled();
    });

    it("passes dry-run publishing through to npm without writing credentials", async () => {
        const context = buildContext(githubOidc);
        context.dryRun = true;
        await npmAuthenticate(context, DEFAULT_NPM_REGISTRY);
        await npmPublish(context, { pkgSpec: "example", tag: "latest", registry: DEFAULT_NPM_REGISTRY });
        expect(fs.appendFileSync).not.toHaveBeenCalled();
        expect(exec.exec).toHaveBeenCalledExactlyOnceWith(
            "npm",
            ["publish", "--tag", "latest", "--registry=https://registry.npmjs.org/", "--dry-run"],
            { cwd: undefined },
        );
    });
});
