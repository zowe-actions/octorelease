import * as fs from "fs";
import * as core from "@actions/core";
import { IConfig, IProtectedBranch } from "./doc";

export class Config {
    private mConfig: IConfig = {
        protectedBranches: []
    };

    private mConfigFile: string | null;

    constructor() {
        this.mConfigFile = core.getInput("config-file");

        if (fs.existsSync(this.mConfigFile)) {
            this.mConfig = require("js-yaml").safeLoad(fs.readFileSync(this.mConfigFile, "utf-8"));
        } else {
            core.info(`Config file ${this.mConfigFile} not found so continuing with default config`);
            this.mConfigFile = null;
        }
    }

    public getProtectedBranch(branchName: string): IProtectedBranch {
        // Use default config if config file not found
        if (this.mConfigFile == null) {
            return { name: branchName };
        }

        const branchNames: string[] = this.mConfig.protectedBranches.map(branch => branch.name);

        // Check if protected branch is in config
        if (!branchNames.includes(branchName)) {
            core.info(`${branchName} is not a protected branch in ${this.mConfigFile} so exiting now`);
            process.exit();
        }

        return this.mConfig.protectedBranches[branchNames.indexOf(branchName)];
    }
}
