import * as fs from "fs";
import * as core from "@actions/core";
import { IConfig, IProtectedBranch } from "./doc";

export class Config {
    private mConfig: IConfig | null = null;

    private mConfigFile: string;

    constructor() {
        this.mConfigFile = core.getInput("config-file");

        if (fs.existsSync(this.mConfigFile)) {
            this.mConfig = require("js-yaml").safeLoad(fs.readFileSync(this.mConfigFile, "utf-8"));
        } else {
            core.info(`Config file ${this.mConfigFile} not found so continuing with default config`);
        }
    }

    public getProtectedBranch(currentBranch: string): IProtectedBranch {
        // Use default config if config file not found
        if (this.mConfig == null) {
            return { name: currentBranch };
        }

        const branchNames: string[] = this.mConfig.protectedBranches.map(branch => branch.name);
        const minimatch = require("minimatch");
        const branchIndex: number = branchNames.findIndex((branch) => minimatch(currentBranch, branch));

        // Check if protected branch is in config
        if (branchIndex === -1) {
            core.info(`${currentBranch} is not a protected branch in ${this.mConfigFile} so exiting now`);
            process.exit();
        }

        return this.renderBranchName({
            ...this.mConfig.protectedBranches[branchIndex],
            name: currentBranch
        }, currentBranch);
    }

    private renderBranchName(obj: any, branchName: string): any {
        return JSON.parse(JSON.stringify(obj), (key, value) => {
            return (typeof value === "string") ? value.replace("${name}", branchName) : value;
        });
    }
}
