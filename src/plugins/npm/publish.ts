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

    const npmRegistry: string | undefined = packageJson.publishConfig?.registry;
    let npmScope: string | undefined;

    if (npmRegistry == null) {
        throw new Error("Expected NPM registry to be defined in package.json but it is not");
    }

    if (packageJson.name.includes("/")) {
        npmScope = packageJson.name.split("/")[0];
    }

    utils.npmConfig(context, npmRegistry, npmScope);

    try {
        // Publish package
        const alreadyPublished = await utils.npmViewVersion(packageJson.name, packageJson.version);
        if (!alreadyPublished) {
            await utils.npmPublish(context.branch.tag, inDir);
        } else {
            core.error(`Version ${packageJson.version} has already been published to NPM`);
        }

        // Add alias tags
        if (context.branch.aliasTags) {
            for (const tag of context.branch.aliasTags) {
                await utils.npmAddTag(packageJson.name, packageJson.version, tag, inDir);
            }
        }
    } finally {
        utils.npmReset();
    }
}
