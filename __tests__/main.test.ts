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
        const ip = path.join(import.meta.dirname, "..", "packages", "core", "lib", "main.js");
        const options: cp.ExecSyncOptions = {
            env: process.env,
        };
        console.log(`node ${ip}`, options);
        try {
            console.log(cp.execSync(`node ${ip}`, options).toString());
        } catch (err) {
            const execErr = err as cp.ExecException & { stdout?: Buffer; stderr?: Buffer };
            throw new Error(
                `${execErr.message}\n--- stdout ---\n${execErr.stdout?.toString()}\n--- stderr ---\n${execErr.stderr?.toString()}`,
            );
        }
    });
});
