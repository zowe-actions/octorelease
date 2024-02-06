/**
 * Copyright 2020-2023 Zowe Actions Contributors
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

import * as fs from "fs";
import * as path from "path";
import * as exec from "@actions/exec";
import { IContext } from "@octorelease/core";
import { DEFAULT_NPM_REGISTRY, IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig, inDir?: string): Promise<void> {
    const cwd = inDir || process.cwd();
    const packageJson = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf-8"));
    const npmRegistry: string = packageJson.publishConfig?.registry || DEFAULT_NPM_REGISTRY;

    if (config.pruneShrinkwrap) {
        if (packageJson.scripts.preshrinkwrap != null) {
            await exec.exec("npm", ["run", "preshrinkwrap"], { cwd });
        }
        pruneShrinkwrap(context, inDir);
    }

    if (config.tarballDir != null) {
        const tgzFile = await utils.npmPack(packageJson.name, npmRegistry, inDir);
        fs.mkdirSync(config.tarballDir, { recursive: true });
        fs.renameSync(path.join(cwd, tgzFile), path.resolve(context.rootDir, config.tarballDir, tgzFile));
    }

    if (config.npmPublish === false) {
        return;
    } else if (fs.existsSync(".npmrc")) {
        fs.renameSync(".npmrc", ".npmrc.bak");
    }

    if (packageJson.private) {
        context.logger.info(`Skipping publish of private package ${packageJson.name}`);
        return;
    }

    try {
        const packageTag = context.branch.channel as string;

        // Publish package
        const publishedVersions = await utils.npmView(packageJson.name, npmRegistry, "versions");
        if (!publishedVersions?.includes(packageJson.version)) {
            await utils.npmPublish(context, {
                tag: packageTag,
                pkgSpec: packageJson.name,
                registry: npmRegistry,
                inDir
            });

            context.releasedPackages.npm = [
                ...(context.releasedPackages.npm || []),
                {
                    name: `${packageJson.name}@${packageJson.version}`,
                    url: npmRegistry === DEFAULT_NPM_REGISTRY ?
                        `https://www.npmjs.com/package/${packageJson.name}/v/${packageJson.version}` : undefined,
                    registry: npmRegistry
                }
            ];
        } else {
            context.logger.error(`Version ${packageJson.version} has already been published to NPM`);
        }

        // Add alias tags
        const aliasTags: string[] = [];
        if (config.aliasTags?.[packageTag] != null) {
            const aliasTagOrTags = config.aliasTags[packageTag];
            aliasTags.push(...(typeof aliasTagOrTags === "string" ? [aliasTagOrTags] : aliasTagOrTags));
        }
        for (const tag of [packageTag, ...aliasTags]) {
            await utils.npmAddTag(context, `${packageJson.name}@${packageJson.version}`, tag, npmRegistry, inDir);
        }
    } finally {
        if (fs.existsSync(".npmrc.bak")) {
            fs.renameSync(".npmrc.bak", ".npmrc");
        }
    }
}

function pruneShrinkwrap(context: IContext, inDir?: string): void {
    const shrinkwrapPath = inDir != null ? path.join(inDir, "npm-shrinkwrap.json") : "npm-shrinkwrap.json";
    const lockfile = JSON.parse(fs.readFileSync(shrinkwrapPath, "utf-8"));
    const filterPkgs = (obj: Record<string, any>, key: string) => {
        if (obj[key] == null) {
            // lockfileVersion 3 does not contain a `dependencies`
            if (key === "dependencies" && lockfile.lockfileVersion === 3) {
                context.logger.info("'Dependencies' is not supported in lockfileVersion 3.");
            }
            context.logger.info(`Property '${key}' does not exist. Skipping prune operation!`);
            return;
        }
        for (const [pkgName, pkgData] of Object.entries(obj[key]) as any) {
            if (["dev", "extraneous"].some(prop => pkgData[prop])) {
                delete obj[key][pkgName];
            }
        }
    };
    filterPkgs(lockfile, "packages");
    filterPkgs(lockfile, "dependencies");
    fs.writeFileSync(shrinkwrapPath, JSON.stringify(lockfile, null, 2) + "\n");
}
