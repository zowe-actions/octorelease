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
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
    const extensionName = `${packageJson.publisher}.${packageJson.name}`;
    let vsixPath: string | undefined;

    if (config.vsixDir != null) {
        const tempVsixPath = await utils.vscePackage(context);
        vsixPath = path.resolve(context.rootDir, config.vsixDir, path.basename(tempVsixPath));
        fs.mkdirSync(config.vsixDir, { recursive: true });
        fs.renameSync(tempVsixPath, vsixPath);
    }

    if (packageJson.private) {
        context.logger.info(`Skipping publish of private package ${packageJson.name}`);
        return;
    }

    if (config.vscePublish !== false) {
        const vsceMetadata = await utils.vsceInfo(extensionName) || {};
        if (context.version.prerelease != null) {
            // VSCE Marketplace doesn't support prerelease tags: https://github.com/microsoft/vsmarketplace/issues/50
            context.logger.warn("Cannot publish version with prerelease tag to VS Code Marketplace");
        } else if (!vsceMetadata.versions?.find((obj: any) => obj.version === packageJson.version)) {
            await utils.vscePublish(context, vsixPath);

            context.releasedPackages.vsce = [
                ...(context.releasedPackages.vsce || []),
                {
                    name: `${extensionName}@${packageJson.version}`,
                    url: `https://marketplace.visualstudio.com/items?itemName=${extensionName}`
                }
            ];
        } else {
            context.logger.error(`Version ${packageJson.version} has already been published to VS Code Marketplace`);
        }
    }

    if (config.ovsxPublish) {
        const ovsxMetadata = await utils.ovsxInfo(extensionName) || {};
        if (!Object.keys(ovsxMetadata.allVersions || {}).includes(packageJson.version)) {
            await utils.ovsxPublish(context, vsixPath);

            context.releasedPackages.vsce = [
                ...(context.releasedPackages.vsce || []),
                {
                    name: `${extensionName}@${packageJson.version} (OVSX)`,
                    url: `https://open-vsx.org/extension/${extensionName.replace(".", "/")}`
                }
            ];
        } else {
            context.logger.error(`Version ${packageJson.version} has already been published to Open VSX Registry`);
        }
    }
}
