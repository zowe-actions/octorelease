import * as fs from "fs";
import * as path from "path";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";
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

    const npmRegistry: string = packageJson.publishConfig?.registry || "https://registry.npmjs.org/";
    const packageTag = context.branch.channel as string;

    // Publish package
    const publishedVersions = await utils.npmView(packageJson.name, "versions");
    if (!publishedVersions?.includes(packageJson.version)) {
        await utils.npmPublish(context, packageTag, npmRegistry, inDir);
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

    context.releasedPackages.npm = [
        ...(context.releasedPackages.npm || []),
        {
            name: packageJson.name,
            version: packageJson.version,
            registry: npmRegistry
        }
    ];
}
