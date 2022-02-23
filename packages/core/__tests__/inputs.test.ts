import { Inputs } from "../src/inputs";

describe("Inputs class", () => {
    let oldProcessEnv: any;

    beforeAll(() => {
        oldProcessEnv = process.env;
    });

    afterAll(() => {
        process.env = oldProcessEnv;
    });

    it("should load dry run setting from environment variable", () => {
        process.env["INPUT_DRY-RUN"] = "false";
        expect(Inputs.dryRun).toBe(false);
        process.env["INPUT_DRY-RUN"] = "true";
        expect(Inputs.dryRun).toBe(true);
    });

    it("should load skip stages setting from environment variable", () => {
        process.env["INPUT_SKIP-STAGES"] = "";
        expect(Inputs.skipStages).toEqual([]);
        process.env["INPUT_SKIP-STAGES"] = "version, publish";
        expect(Inputs.skipStages).toEqual(["version", "publish"]);
    });
});
