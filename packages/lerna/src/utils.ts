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
import * as exec from "@actions/exec";
import { type IContext, type IPackageRelease, utils } from "@octorelease/core";
import * as semver from "semver";
import type { IPluginConfig } from "./config";
import { LernaState } from "./state";

let usePnpm: boolean;
async function npxCmd(binName: "lerna"): Promise<string> {
    if (usePnpm == null) {
        try {
            usePnpm = (await exec.exec("pnpm", ["--version"], { silent: true })) === 0;
        } catch {
            usePnpm = false;
        }
    }
    // pnpm doesn't have a direct npx equivalent so dlx always downloads and exec never does
    return usePnpm ? `pnpm ${(await utils.commandExists(binName)) ? "exec" : "dlx"}` : "npx";
}

export async function getLernaMajorVersion(): Promise<number> {
    // If using lerna lite, the version is "unknown" so this function will return NaN
    const cmdOutput = await exec.getExecOutput(await npxCmd("lerna"), ["lerna", "--version"]);
    return parseInt(cmdOutput.stdout.split(".", 1)[0]);
}

export async function lernaList(onlyChanged?: boolean, since?: string): Promise<Record<string, any>[]> {
    const cmdArgs = ["lerna"];
    if (onlyChanged && since != null) {
        // An explicit ref also supports lightweight tags ignored by `lerna changed`.
        cmdArgs.push("list", "--since", since, "--include-merged-tags");
    } else if (onlyChanged) {
        cmdArgs.push("changed", "--include-merged-tags");
    } else {
        cmdArgs.push("list");
    }
    cmdArgs.push("--all", "--json", "--toposort");
    const cmdOutput = await exec.getExecOutput("npx", cmdArgs, { ignoreReturnCode: onlyChanged && since == null });
    return cmdOutput.exitCode === 0 ? JSON.parse(cmdOutput.stdout) : [];
}

export async function lernaVersion(newVersion: string): Promise<void> {
    await exec.exec(await npxCmd("lerna"), [
        "lerna",
        "version",
        newVersion,
        "--exact",
        "--include-merged-tags",
        "--no-git-tag-version",
        "--yes",
    ]);
}

export async function lernaPostVersion(): Promise<void> {
    if (!fs.existsSync("yarn.lock") && !usePnpm) {
        // Update subpackage versions in lockfile (requires npm@8.5 or newer)
        await exec.exec("npm", ["install", "--package-lock-only", "--ignore-scripts", "--no-audit"]);
    } else if (usePnpm) {
        await exec.exec("pnpm", ["install", "--lockfile-only", "--ignore-scripts"]);
    }
}

export function packageTag(name: string, version: string, format = "{{shortName}}-{{version}}"): string {
    if (
        format.split("{{version}}").length !== 2 ||
        (!format.includes("{{name}}") && !format.includes("{{shortName}}"))
    ) {
        throw new Error("packageTagFormat must contain a package name and exactly one {{version}}");
    }
    const tag = format
        .replaceAll("{{name}}", name)
        .replaceAll("{{shortName}}", name.split("/").pop()!)
        .replace("{{version}}", version);
    if (tag.includes("{{") || tag.includes("}}")) {
        throw new Error(`Unknown placeholder in packageTagFormat: ${format}`);
    }
    return tag;
}

/** Plan the entire batch before changing any manifest. */
export async function planPackageReleases(context: IContext, config: IPluginConfig): Promise<IPackageRelease[]> {
    const packages = (LernaState.get(config).workspacePackages ?? (await lernaList()))
        .map(({ location }) => ({
            ...JSON.parse(fs.readFileSync(path.join(location, "package.json"), "utf8")),
            location,
        }))
        .filter((pkg) => !pkg.private);
    const tags = (
        await exec.getExecOutput("git", [
            "for-each-ref",
            "--merged=HEAD",
            "--format=%(refname:strip=2) %(objectname) %(*objectname)",
            "refs/tags",
        ])
    ).stdout
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => {
            const [name, object, peeled] = line.trim().split(/\s+/);
            return { name, commit: peeled || object };
        });
    const head = (await exec.getExecOutput("git", ["rev-parse", "HEAD"])).stdout.trim();
    const retryAllowed =
        !context.version.prerelease &&
        !(await exec.getExecOutput("git", ["diff", "--name-only", "HEAD"])).stdout.trim();
    const changes = new Map<string, Set<string>>();
    const namespaces = new Set<string>();
    const releases: IPackageRelease[] = [];
    for (const pkg of packages) {
        const marker = packageTag(pkg.name, "\0", config.packageTagFormat);
        if (namespaces.has(marker)) {
            throw new Error(`packageTagFormat produces duplicate tag names for ${pkg.name}`);
        }
        namespaces.add(marker);
        const [prefix, suffix] = marker.split("\0");
        const previous = tags
            .flatMap((tag) => {
                if (!tag.name.startsWith(prefix) || !tag.name.endsWith(suffix)) return [];
                const version = tag.name.slice(prefix.length, suffix ? -suffix.length : undefined);
                return semver.valid(version) && !semver.prerelease(version) ? [{ ...tag, version }] : [];
            })
            .sort((a, b) => semver.rcompare(a.version, b.version))[0];
        if (!semver.valid(pkg.version)) throw new Error(`Invalid version for ${pkg.name}: ${pkg.version}`);
        const prerelease = context.version.prerelease;
        let retry = false;
        if (previous) {
            if (!changes.has(previous.commit)) {
                changes.set(previous.commit, new Set((await lernaList(true, previous.commit)).map((p) => p.name)));
            }
            const changed = changes.get(previous.commit)!.has(pkg.name);
            retry = Boolean(retryAllowed) && !changed && previous.commit === head && previous.version === pkg.version;
            if (!changed && !retry) continue;
        }
        if (
            !prerelease &&
            (semver.prerelease(pkg.version) || (previous && !retry && !semver.gt(pkg.version, previous.version)))
        ) {
            throw new Error(
                `Prepare a new stable version for ${pkg.name} in package.json (previous release: ${previous?.version ?? "none"})`,
            );
        }
        const base = semver.parse(pkg.version)!;
        const newVersion = prerelease ? `${base.major}.${base.minor}.${base.patch}-${prerelease}` : pkg.version;
        const tagName = packageTag(pkg.name, newVersion, config.packageTagFormat);
        await exec.exec("git", ["check-ref-format", `refs/tags/${tagName}`]);
        releases.push({
            name: pkg.name,
            directory: path.relative(context.rootDir, pkg.location),
            version: { old: previous?.version ?? "0.0.0", new: newVersion, prerelease },
            tagName: prerelease ? undefined : tagName,
        });
    }
    return releases;
}
