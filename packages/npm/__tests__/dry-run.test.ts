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
import publish from "../src/publish";
import success from "../src/success";
import { npmView } from "../src/utils";

vi.mock("@actions/exec", () => ({ exec: vi.fn().mockResolvedValue(0), getExecOutput: vi.fn() }));

const registry = "https://registry.example.invalid/";
const notFound = { exitCode: 1, stdout: JSON.stringify({ error: { code: "E404" } }), stderr: "npm error code E404" };

it("dry-runs publication without recording a release or polling/installing it", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "octorelease-npm-dry-run-"));
    const cwd = process.cwd();
    try {
        process.chdir(root);
        fs.writeFileSync("package.json", JSON.stringify({ name: "@example/pkg", version: "1.0.0-next.1" }));
        vi.mocked(exec.getExecOutput).mockImplementation(async (_cmd, args) =>
            args?.[0] === "pack" ? { exitCode: 0, stdout: "example-pkg.tgz\n", stderr: "" } : notFound,
        );
        const context = {
            dryRun: true,
            branch: { channel: "next" },
            releasedPackages: {},
            logger: { info: vi.fn() },
        } as unknown as IContext;
        await publish(context, { publishRegistry: registry });
        await success(context, { smokeTest: true });
        expect(exec.exec).toHaveBeenCalledWith(
            "npm",
            expect.arrayContaining(["publish", "--dry-run"]),
            expect.anything(),
        );
        expect(context.releasedPackages.npm).toBeUndefined();
        expect(exec.getExecOutput).toHaveBeenCalledTimes(2); // pack and one existence check
        expect(
            vi.mocked(exec.exec).mock.calls.some(([, args]) => args?.[0] === "install" || args?.[0] === "dist-tag"),
        ).toBe(false);
    } finally {
        process.chdir(cwd);
        fs.rmSync(root, { recursive: true, force: true });
    }
});

it("skips the entire smoke test even if a plugin recorded would-be releases", async () => {
    const context = {
        dryRun: true,
        releasedPackages: { npm: [{ name: "@example/pkg@1.0.0", registry }] },
        logger: { info: vi.fn() },
    } as unknown as IContext;
    await success(context, { smokeTest: true });
    expect(exec.getExecOutput).not.toHaveBeenCalled();
    expect(exec.exec).not.toHaveBeenCalled();
});

it("treats a first-publish 404 as an absent package without printing npm errors", async () => {
    vi.mocked(exec.getExecOutput).mockResolvedValue(notFound);
    await expect(npmView("@example/pkg", registry, "versions")).resolves.toBeUndefined();
    expect(exec.getExecOutput).toHaveBeenCalledWith("npm", expect.anything(), { ignoreReturnCode: true, silent: true });
});

it.each(["E401", "E403", "E500", "ENOTFOUND"])("does not hide %s registry errors", async (code) => {
    vi.mocked(exec.getExecOutput).mockResolvedValue({
        exitCode: 1,
        stdout: JSON.stringify({ error: { code } }),
        stderr: `npm error code ${code}`,
    });
    await expect(npmView("@example/pkg", registry)).rejects.toThrow(code);
});

it("returns successful registry metadata", async () => {
    vi.mocked(exec.getExecOutput).mockResolvedValue({ exitCode: 0, stdout: '["1.0.0"]', stderr: "" });
    await expect(npmView("@example/pkg", registry, "versions")).resolves.toEqual(["1.0.0"]);
});
