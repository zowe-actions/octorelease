import * as core from "@actions/core";

export class Inputs {
    public static get configDir(): string | undefined {
        return core.getInput("config-dir") || undefined;
    }

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

    public static get newVersion(): string | undefined {
        return core.getInput("new-version") || undefined;
    }

    public static get skipStages(): string[] {
        const input = core.getInput("skip-stages");
        return input ? input.split(",").map(s => s.trim()) : [];
    }

    public static get workingDir(): string | undefined {
        return core.getInput("working-dir") || undefined;
    }
}
