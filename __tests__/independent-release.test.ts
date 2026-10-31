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

import * as cp from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import * as exec from "@actions/exec";
import type { IContext } from "@octorelease/core";
import changelog from "../packages/changelog/src/version";
import * as gitUtils from "../packages/git/src/utils";
import gitVersion from "../packages/git/src/version";
import { packageTag, planPackageReleases } from "../packages/lerna/src/utils";

vi.mock("@actions/exec", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@actions/exec")>();
    return { ...actual, getExecOutput: vi.fn(actual.getExecOutput) };
});
vi.mock("../packages/git/src/utils", async (importOriginal) => ({
    ...(await importOriginal<typeof import("../packages/git/src/utils")>()),
    gitPush: vi.fn().mockResolvedValue(true),
}));

let root: string;
let cwd: string;
let context: IContext;
const config = { versionIndependent: true };
const names = ["core", "plugin", "unchanged", "private"];
const git = (...args: string[]) => cp.execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const read = (name: string) => JSON.parse(fs.readFileSync(path.join(root, `packages/${name}/package.json`), "utf8"));
const write = (name: string, version: string) =>
    fs.writeFileSync(
        path.join(root, `packages/${name}/package.json`),
        JSON.stringify({ ...read(name), version }, null, 2) + "\n",
    );
const commit = (message: string) => {
    git("add", ".");
    git("commit", "-qm", message);
};

beforeEach(async () => {
    cwd = process.cwd();
    root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "octorelease-package-tags-")));
    process.chdir(root);
    git("init", "-q");
    git("config", "user.name", "Release test");
    git("config", "user.email", "release@example.invalid");
    git("config", "commit.gpgsign", "false");
    git("config", "tag.gpgsign", "false");
    git("config", "core.hooksPath", path.join(root, "no-hooks"));
    for (const name of names) {
        fs.mkdirSync(path.join(root, "packages", name), { recursive: true });
        fs.writeFileSync(
            path.join(root, `packages/${name}/package.json`),
            JSON.stringify({
                name: `@octorelease/${name}`,
                version: name === "plugin" ? "0.1.0" : "1.0.0",
                private: name === "private",
            }),
        );
        fs.writeFileSync(
            path.join(root, `packages/${name}/CHANGELOG.md`),
            `# Changelog\n\n## Recent Changes\n\n* ${name} changes\n`,
        );
    }
    commit("baseline");
    for (const name of names.filter((name) => name !== "private")) git("tag", `${name}-${read(name).version}`);
    context = {
        rootDir: root,
        workspaces: ["packages/*"],
        tagPrefix: "v",
        dryRun: false,
        branch: { name: "master" },
        version: { old: "9.0.0", new: "9.0.0", overrides: {} },
        packageReleases: [],
        changedFiles: [],
        logger: { info: vi.fn(), warn: vi.fn(), debug: vi.fn() },
    } as unknown as IContext;
    const actualExec = await vi.importActual<typeof import("@actions/exec")>("@actions/exec");
    vi.mocked(exec.getExecOutput).mockImplementation(async (command, args, options) => {
        if (command !== "npx") return actualExec.getExecOutput(command, args, options);
        const sinceIndex = args!.indexOf("--since");
        const packages = names
            .filter(
                (name) =>
                    sinceIndex === -1 ||
                    git("diff", "--name-only", args![sinceIndex + 1], "--", `packages/${name}`).length > 0,
            )
            .map((name) => ({ ...read(name), location: path.join(root, "packages", name) }));
        return { exitCode: 0, stdout: JSON.stringify(packages), stderr: "" };
    });
});

afterEach(() => {
    process.chdir(cwd);
    fs.rmSync(root, { recursive: true, force: true });
});

async function plan() {
    context.packageReleases = await planPackageReleases(context, config);
    for (const release of context.packageReleases) {
        context.version.overrides[release.directory] = release.version;
        context.changedFiles.push(path.join(release.directory, "package.json"));
    }
}

it("creates package changelogs and multiple tags on one release commit, and supports reruns", async () => {
    write("core", "1.1.0");
    write("plugin", "0.2.0");
    await plan();
    expect(context.packageReleases?.map((p) => p.tagName)).toEqual(["core-1.1.0", "plugin-0.2.0"]);
    await changelog(context, {});
    expect(context.packageReleases?.[1].releaseNotes).toBe("* plugin changes");
    expect(fs.readFileSync("packages/plugin/CHANGELOG.md", "utf8")).toContain("## `0.2.0`");
    expect(fs.readFileSync("packages/unchanged/CHANGELOG.md", "utf8")).toContain("## Recent Changes");
    const before = git("rev-parse", "HEAD");
    await gitVersion(context, {});
    const head = git("rev-parse", "HEAD");
    expect(head).not.toBe(before);
    expect(git("rev-list", "--count", `${before}..HEAD`)).toBe("1");
    expect(git("rev-parse", "core-1.1.0^{commit}")).toBe(head);
    expect(git("rev-parse", "plugin-0.2.0^{commit}")).toBe(head);
    expect(context.releaseCommit).toBe(head);
    const retry = await planPackageReleases(context, config);
    expect(retry.map((p) => p.tagName)).toEqual(["core-1.1.0", "plugin-0.2.0"]);
    await gitVersion(context, {});
    expect(git("rev-parse", "HEAD")).toBe(head);
});

it("compares each package with its own last release and excludes prerelease tags", async () => {
    write("core", "1.1.0");
    commit("core release");
    git("tag", "core-1.1.0");
    write("plugin", "0.2.0");
    commit("plugin release");
    git("tag", "plugin-0.2.0");
    fs.writeFileSync("packages/core/new.js", "// changed\n");
    commit("core changed");
    git("tag", "core-99.0.0-next.1");
    context.version.prerelease = "next.202610311200";
    await plan();
    expect(context.packageReleases?.map((p) => p.name)).toEqual(["@octorelease/core"]);
    expect(context.packageReleases?.[0].version).toEqual({
        old: "1.1.0",
        new: "1.1.0-next.202610311200",
        prerelease: "next.202610311200",
    });
    expect(context.packageReleases?.[0].tagName).toBeUndefined();
    const before = git("rev-parse", "HEAD");
    const tags = git("tag", "--list");
    await changelog(context, {});
    await gitVersion(context, {});
    expect(git("rev-parse", "HEAD")).toBe(before);
    expect(git("tag", "--list")).toBe(tags);
    expect(gitUtils.gitPush).not.toHaveBeenCalled();
});

it("rejects changed stable packages without a new version before changing any files", async () => {
    fs.writeFileSync("packages/core/new.js", "// changed\n");
    commit("changed without bump");
    await expect(plan()).rejects.toThrow("Prepare a new stable version for @octorelease/core");
    expect(git("status", "--porcelain")).toBe("");
});

it("does not select unchanged snapshots and publishes first releases without previous tags", async () => {
    context.version.prerelease = "next.202610311200";
    expect(await planPackageReleases(context, config)).toEqual([]);
    git("tag", "-d", "plugin-0.1.0");
    expect((await planPackageReleases(context, config)).map((p) => p.name)).toEqual(["@octorelease/plugin"]);
});

it("does not create commits or tags in dry runs and refuses to move an existing tag", async () => {
    write("core", "1.1.0");
    await plan();
    context.dryRun = true;
    const before = git("rev-parse", "HEAD");
    await gitVersion(context, {});
    expect(git("rev-parse", "HEAD")).toBe(before);
    expect(git("tag", "--list", "core-1.1.0")).toBe("");
    commit("changed");
    await expect(gitUtils.gitTag("core-1.0.0", undefined, git("rev-parse", "HEAD"))).rejects.toThrow("another commit");
});

it("supports Lerna, npm/cli, and legacy tag names, with validated templates", () => {
    expect(packageTag("@octorelease/core", "1.0.0")).toBe("core-1.0.0");
    expect(packageTag("@octorelease/core", "1.0.0", "{{shortName}}-v{{version}}")).toBe("core-v1.0.0");
    expect(packageTag("@octorelease/core", "1.0.0", "{{name}}@{{version}}")).toBe("@octorelease/core@1.0.0");
    expect(() => packageTag("core", "1.0.0", "v{{version}}")).toThrow("must contain");
    expect(() => packageTag("core", "1.0.0", "{{name}}-{{bad}}-{{version}}")).toThrow("Unknown placeholder");
});

it("discovers annotated package tags as well as lightweight tags", async () => {
    git("tag", "-d", "plugin-0.1.0");
    git("tag", "-a", "plugin-0.1.0", "-m", "plugin release");
    write("plugin", "0.2.0");
    await plan();
    expect(context.packageReleases?.map((p) => [p.tagName, p.version.old])).toEqual([["plugin-0.2.0", "0.1.0"]]);
});

it("rejects ambiguous short package names before mutating manifests", async () => {
    for (const [name, scope] of [
        ["core", "a"],
        ["plugin", "b"],
    ]) {
        fs.writeFileSync(`packages/${name}/package.json`, JSON.stringify({ ...read(name), name: `@${scope}/shared` }));
    }
    await expect(plan()).rejects.toThrow("duplicate tag names");
    expect(read("core").version).toBe("1.0.0");
});
