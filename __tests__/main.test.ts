import * as cp from "child_process";
import * as fs from "fs";
import * as path from "path";

describe("CI tests", () => {
    beforeAll(() => {
        fs.writeFileSync(".releaserc", JSON.stringify({ branches: ["master", "next"] }));
    });

    afterAll(() => {
        fs.unlinkSync(".releaserc");
    });

    // shows how the runner will run a javascript action with env / stdout protocol
    (process.env.CI ? it : it.skip)("test runs", () => {
        process.env["INPUT_DRY-RUN"] = "true";
        const ip = path.join(__dirname, "..", "packages", "core", "lib", "main.js");
        const options: cp.ExecSyncOptions = {
            env: process.env
        };
        console.log(`node ${ip}`, options);
        console.log(cp.execSync(`node ${ip}`, options).toString());
    });
});
