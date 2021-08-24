import * as core from "@actions/core";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";

export default async function (context: IContext, config: IPluginConfig): Promise<void> {
    if (config.coverageFiles == null) {
        throw new Error("List of lcov coverage files must be defined for coverage plugin");
    }

    const coverageThreshold = config.coverageThreshold || 80;
    core.info(`Checking that coverage threshold of ${coverageThreshold}% is met`);

    const lcovTotal = require("lcov-total");
    let numFailed = 0;
    for (const coverageFile of config.coverageFiles) {
        const coverage = lcovTotal(coverageFile);
        if (coverage < coverageThreshold) {
            core.error(`${coverageFile}: ${coverage}%`);
            numFailed++;
        } else {
            core.info(`${coverageFile}: ${coverage}%`);
        }
    }

    if (numFailed > 0) {
        throw new Error("One or more coverage files did not meet the coverage threshold");
    }
}
