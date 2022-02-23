import * as path from "path";
import * as core from "@actions/core";

export class Inputs {
    private static readonly rootDir = process.cwd();

    public static get configDir(): string | undefined {
        const input = core.getInput("config-dir");
        return input ? path.resolve(this.rootDir, input) : undefined;
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
