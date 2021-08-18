import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import { IContext } from "../../doc";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, config: IPluginConfig, inDir?: string): Promise<void> {
    const cwd = inDir || process.cwd();

    if (config.tarballDir != null) {
        const tgzFile = await utils.npmPack(inDir);
        fs.mkdirSync(config.tarballDir, { recursive: true });
        fs.renameSync(path.join(cwd, tgzFile), path.resolve(config.tarballDir, tgzFile));
    }

    if (!config.npmPublish) {
        return;
    }

    const packageJson = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf-8"));

    if (packageJson.private) {
        core.info(`Skipping publish of private package ${packageJson.name}`);
    }

    const npmRegistry: string = packageJson.publishConfig?.registry || "https://registry.npmjs.org/";
    const packageTag = context.branch.channel as string;

    // Publish package
    const alreadyPublished = await utils.npmViewVersion(packageJson.name, packageJson.version);
    if (!alreadyPublished) {
        await utils.npmPublish(packageTag, npmRegistry, inDir);
    } else {
        core.error(`Version ${packageJson.version} has already been published to NPM`);
    }

    // Add alias tags
    if (config.aliasTags?.[packageTag] != null) {
        const aliasTagOrTags = config.aliasTags[packageTag];
        const aliasTags: string[] = (typeof aliasTagOrTags === "string") ? [aliasTagOrTags] : aliasTagOrTags;
        for (const tag of aliasTags) {
            await utils.npmAddTag(packageJson.name, packageJson.version, tag, inDir);
        }
    }
}
