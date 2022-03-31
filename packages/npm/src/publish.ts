/**
 * Copyright 2022 Octorelease Contributors
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
import { IContext } from "@octorelease/core";
import { DEFAULT_NPM_REGISTRY, IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig, inDir?: string): Promise<void> {
    const cwd = inDir || process.cwd();

    if (config.tarballDir != null) {
        const tgzFile = await utils.npmPack(inDir);
        fs.mkdirSync(config.tarballDir, { recursive: true });
        fs.renameSync(path.join(cwd, tgzFile), path.resolve(config.tarballDir, tgzFile));
    }

    if (config.npmPublish === false) {
        return;
    }

    const packageJson = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf-8"));

    if (packageJson.private) {
        context.logger.info(`Skipping publish of private package ${packageJson.name}`);
        return;
    }

    const npmRegistry: string = packageJson.publishConfig?.registry || DEFAULT_NPM_REGISTRY;
    const packageTag = context.branch.channel as string;

    // Publish package
    const publishedVersions = await utils.npmView(packageJson.name, npmRegistry, "versions");
    if (!publishedVersions?.includes(packageJson.version)) {
        await utils.npmPublish(context, packageTag, npmRegistry, inDir);

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
    if (config.aliasTags?.[packageTag] != null) {
        const aliasTagOrTags = config.aliasTags[packageTag];
        const aliasTags: string[] = (typeof aliasTagOrTags === "string") ? [aliasTagOrTags] : aliasTagOrTags;
        for (const tag of aliasTags) {
            await utils.npmAddTag(context, packageJson.name, packageJson.version, tag, npmRegistry, inDir);
        }
    }
}
