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
import type { IContext } from "@octorelease/core";
import { publish as npmPublish, utils as npmUtils } from "@octorelease/npm";
import { Inputs } from "../../core/src/inputs";
import { verifyConditions } from "../../core/src/utils";
import type { IPluginConfig } from "../src/config";
import init from "../src/init";
import publish from "../src/publish";
import * as utils from "../src/utils";
import version from "../src/version";

vi.mock("../src/utils", () => ({
    planPackageReleases: vi.fn(),
    getLernaMajorVersion: vi.fn().mockResolvedValue(8),
    lernaList: vi.fn(),
    lernaVersion: vi.fn(),
    lernaPostVersion: vi.fn(),
}));

vi.mock("@octorelease/npm", () => ({
    DEFAULT_NPM_REGISTRY: "https://registry.npmjs.org/",
    publish: vi.fn(),
    utils: { npmVersion: vi.fn(), npmConfig: vi.fn(), verifyConditions: vi.fn() },
}));

let root: string;
let previousCwd: string;
let context: IContext;
let changed: string[];
const suffix = "next.202610311200";
const read = (file: string) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const write = (file: string, data: object) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`);
};

beforeEach(() => {
    previousCwd = process.cwd();
    root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "octorelease-independent-")));
    process.chdir(root);
    write("package.json", { name: "fixture", private: true, version: "9.0.0", workspaces: ["packages/*"] });
    write("package-lock.json", {});
    for (const [name, packageVersion] of Object.entries({
        core: "1.0.0",
        plugin: "0.1.0",
        unchanged: "1.0.0",
        private: "1.0.0",
    })) {
        write(`packages/${name}/package.json`, {
            name: `@octorelease/${name}`,
            version: packageVersion,
            ...(name === "private" ? { private: true } : {}),
            ...(name === "core" ? {} : { peerDependencies: { "@octorelease/core": "^1.0.0-next" } }),
        });
    }
    changed = ["core", "plugin", "private"];
    vi.mocked(utils.planPackageReleases).mockImplementation(async (ctx) =>
        changed
            .filter((name) => name !== "private")
            .map((name) => {
                const pkg = read(`packages/${name}/package.json`);
                const prerelease = ctx.version.prerelease;
                const next = prerelease ? `${pkg.version.split("-")[0]}-${prerelease}` : pkg.version;
                return {
                    name: pkg.name,
                    directory: path.join("packages", name),
                    version: { old: "0.0.0", new: next, prerelease },
                    tagName: prerelease ? undefined : `${pkg.name}@${next}`,
                };
            }),
    );
    vi.mocked(utils.lernaList).mockImplementation(async (onlyChanged) =>
        ["core", "plugin", "unchanged", "private"]
            .filter((name) => !onlyChanged || changed.includes(name))
            .map((name) => ({ ...read(`packages/${name}/package.json`), location: path.join(root, "packages", name) })),
    );
    vi.mocked(npmUtils.npmVersion).mockImplementation(async (newVersion, location) => {
        const file = path.relative(root, path.join(location!, "package.json"));
        write(file, { ...read(file), version: newVersion });
    });
    vi.spyOn(Inputs, "newVersion", "get").mockReturnValue(undefined);
    context = {
        rootDir: root,
        tagPrefix: "v",
        branch: { name: "master", channel: "next" },
        version: { old: "1.5.7", new: "1.5.7", prerelease: suffix, overrides: {} },
        changedFiles: [],
        env: {},
        logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn() },
    } as unknown as IContext;
});

afterEach(() => {
    process.chdir(previousCwd);
    fs.rmSync(root, { recursive: true, force: true });
    vi.restoreAllMocks();
});

async function release(config: IPluginConfig) {
    await init(context, config);
    await verifyConditions(context);
    await version(context, config);
}

it("requires an explicit independent mode when configuring package tag names", async () => {
    await expect(init(context, { packageTagFormat: "{{name}}@{{version}}", npmPublish: false })).rejects.toThrow(
        "requires versionIndependent: true",
    );
});

it("uses package bases for snapshots and publishes only changed public packages", async () => {
    const config: IPluginConfig = { versionIndependent: true, npmPublish: false };
    await release(config);
    expect(read("lerna.json").version).toBe("independent");
    expect(utils.planPackageReleases).toHaveBeenCalledWith(context, config);
    expect(read("package.json").version).toBe("9.0.0");
    expect(read("packages/core/package.json").version).toBe(`1.0.0-${suffix}`);
    expect(read("packages/plugin/package.json").version).toBe(`0.1.0-${suffix}`);
    expect(read("packages/plugin/package.json").peerDependencies["@octorelease/core"]).toBe("^1.0.0-next");
    expect(read("packages/unchanged/package.json").version).toBe("1.0.0");
    expect(read("packages/private/package.json").version).toBe("1.0.0");
    expect(context.version.overrides[path.join("packages", "plugin")].new).toBe(`0.1.0-${suffix}`);
    expect(utils.lernaVersion).not.toHaveBeenCalled();
    await publish(context, config);
    expect(vi.mocked(npmPublish).mock.calls.map((call) => path.basename(call[2]!))).toEqual(["core", "plugin"]);
});

it("keeps prepared stable versions even when the shared version does not change", async () => {
    context.version.prerelease = undefined;
    const config: IPluginConfig = { versionIndependent: true, npmPublish: false };
    await release(config);
    expect(npmUtils.npmVersion).toHaveBeenCalledWith("1.0.0", path.join(root, "packages/core"));
    expect(npmUtils.npmVersion).toHaveBeenCalledWith("0.1.0", path.join(root, "packages/plugin"));
    await publish(context, config);
    expect(npmPublish).toHaveBeenCalledTimes(2);
});

it.each(["independent", "5.0.0"])(
    "preserves existing lerna.json version %s and ignores shared bumps",
    async (lernaVersion) => {
        write("lerna.json", { version: lernaVersion });
        vi.spyOn(Inputs, "newVersion", "get").mockReturnValue("2.0.0");
        await release({ versionIndependent: true, npmPublish: false });
        expect(read("lerna.json").version).toBe(lernaVersion);
        expect(read("packages/core/package.json").version).toBe(`1.0.0-${suffix}`);
        expect(read("packages/plugin/package.json").version).toBe(`0.1.0-${suffix}`);
    },
);

it("replaces existing prerelease suffixes and updates internal dependencies", async () => {
    write("packages/core/package.json", { name: "@octorelease/core", version: "1.0.0-next.old" });
    const file = "packages/plugin/package.json";
    write(file, { ...read(file), dependencies: { "@octorelease/core": "^1.0.0-next" } });
    await release({ versionIndependent: true, npmPublish: false });
    expect(read("packages/core/package.json").version).toBe(`1.0.0-${suffix}`);
    expect(read(file).dependencies["@octorelease/core"]).toBe(`^1.0.0-${suffix}`);
    expect(read(file).peerDependencies["@octorelease/core"]).toBe("^1.0.0-next");
});

it("does not publish anything when only private packages changed", async () => {
    changed = ["private"];
    const config: IPluginConfig = { versionIndependent: true, npmPublish: false };
    await release(config);
    await publish(context, config);
    expect(npmUtils.npmVersion).not.toHaveBeenCalled();
    expect(npmPublish).not.toHaveBeenCalled();
});

it("preserves selective override behavior", async () => {
    write("lerna.json", { version: "1.6.0" });
    await release({ versionIndependent: ["@octorelease/plugin"], npmPublish: false });
    expect(read("packages/core/package.json").version).toBe(`1.6.0-${suffix}`);
    expect(read("packages/plugin/package.json").version).toBe(`0.2.0-${suffix}`);
    expect(read("lerna.json").version).toBe(`1.6.0-${suffix}`);
});

it.each([false, undefined])(
    "uses shared Lerna versioning when versionIndependent is %s",
    async (versionIndependent) => {
        write("lerna.json", { version: "1.6.0" });
        await release({ versionIndependent, npmPublish: false });
        expect(utils.lernaVersion).toHaveBeenCalledWith(`1.6.0-${suffix}`);
        expect(npmUtils.npmVersion).not.toHaveBeenCalled();
    },
);
