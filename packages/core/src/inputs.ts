import * as core from "@actions/core";

export class Inputs {
    public static get dryRun(): boolean {
        try {
            return core.getBooleanInput("dry-run");
        } catch (error) {
            if (error instanceof TypeError) {
                return false;
            }
            throw error;
        }
    }

    public static get skipStages(): string[] {
        const input = core.getInput("skip-stages");
        return input ? input.split(",").map(s => s.trim()) : [];
    }

    public static get workingDirectory(): string {
        return core.getInput("working-directory");
    }
}
