import * as path from "path";
import * as core from "@actions/core";

/**
 * Class for accessing GitHub action inputs.
 * If Octorelease is used outside of GitHub Actions, these inputs can be
 * supplied as environment variables. For example, the "dry-run" input is
 * associated with the "INPUT_DRY-RUN" environment variable.
 */
export class Inputs {
    private static readonly rootDir = process.cwd();

    /**
     * Custom directory to search for release configuration.
     */
    public static get configDir(): string | undefined {
        const input = core.getInput("config-dir");
        return input ? path.resolve(this.rootDir, input) : undefined;
    }

    /**
     * Don't make any changes but report what would have been done.
     */
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

    /**
     * New version number that should be released.
     */
    public static get newVersion(): string | undefined {
        return core.getInput("new-version") || undefined;
    }

    /**
     * Comma-separated list of stages that should be skipped.
     */
    public static get skipStages(): string[] {
        const input = core.getInput("skip-stages");
        return input ? input.split(",").map(s => s.trim()) : [];
    }

    /**
     * Custom working directory to use instead of the project root.
     */
    public static get workingDir(): string | undefined {
        return core.getInput("working-dir") || undefined;
    }
}
