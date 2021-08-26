import * as core from "@actions/core";

export class Inputs {
    public static get dryRun(): boolean {
        return core.getBooleanInput("dry-run");
    }

    public static get skipStages(): string[] {
        return core.getInput("skip-stages").split(",").map(s => s.trim());
    }
}
