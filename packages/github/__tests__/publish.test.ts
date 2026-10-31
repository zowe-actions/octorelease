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

import type { IContext } from "@octorelease/core";
import publish from "../src/publish";
import * as utils from "../src/utils";

vi.mock("../src/utils", () => ({ getOctokit: vi.fn() }));

const repos = {
    getReleaseByTag: vi.fn(),
    createRelease: vi.fn(),
    updateRelease: vi.fn(),
};
let context: IContext;

beforeEach(() => {
    repos.getReleaseByTag.mockRejectedValue(Object.assign(new Error("Not found"), { status: 404 }));
    repos.createRelease.mockResolvedValue({ data: { id: 123 } });
    vi.mocked(utils.getOctokit).mockReturnValue({ rest: { repos } } as unknown as utils.Octokit);
    context = {
        ci: { repo: { owner: "owner", repo: "repo" } },
        dryRun: false,
        logger: { info: vi.fn() },
        tagPrefix: "v",
        version: { old: "1.0.0", new: "1.1.0", overrides: {} },
        releaseCommit: "abc123",
        packageReleases: [
            {
                name: "@octorelease/core",
                directory: "packages/core",
                version: { old: "1.0.0", new: "1.1.0" },
                tagName: "core-1.1.0",
                releaseNotes: "core notes",
            },
            {
                name: "@octorelease/exec",
                directory: "packages/exec",
                version: { old: "0.1.0", new: "0.2.0" },
                tagName: "exec-0.2.0",
                releaseNotes: "exec notes",
            },
        ],
    } as unknown as IContext;
});

it("creates separate package releases at one SHA with their own notes", async () => {
    await publish(context, { publishRelease: true });
    expect(repos.createRelease.mock.calls.map(([args]) => [args.tag_name, args.target_commitish, args.body])).toEqual([
        ["core-1.1.0", "abc123", "core notes"],
        ["exec-0.2.0", "abc123", "exec notes"],
    ]);
    expect(repos.updateRelease).toHaveBeenCalledTimes(2);
    expect(repos.updateRelease).toHaveBeenCalledWith(expect.objectContaining({ make_latest: "false" }));
});

it.each(["snapshot", "empty", "dry run"])("creates no remote releases for %s", async (mode) => {
    if (mode === "snapshot") context.version.prerelease = "next.202610311200";
    if (mode === "empty") context.packageReleases = [];
    if (mode === "dry run") context.dryRun = true;
    await publish(context, { publishRelease: true });
    expect(repos.createRelease).not.toHaveBeenCalled();
    expect(repos.updateRelease).not.toHaveBeenCalled();
});

it("preserves the shared release tag and notes", async () => {
    context.packageReleases = undefined;
    context.releaseNotes = "shared notes";
    await publish(context, { publishRelease: true });
    expect(repos.createRelease).toHaveBeenCalledWith(
        expect.objectContaining({ tag_name: "v1.1.0", body: "shared notes" }),
    );
    expect(repos.updateRelease).toHaveBeenCalledWith(expect.objectContaining({ make_latest: "legacy" }));
});
