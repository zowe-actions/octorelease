import * as fs from "fs";
import { StringDecoder } from "string_decoder";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { cosmiconfig } from "cosmiconfig";
import { IContext } from "../doc/IContext";

function requireEnvVar(name: string): string {
    const value = process.env[name];
    if (value == null) {
        throw new Error(`Required environment variable ${name} is not defined`);
    }
    return value;
}

export async function buildContext(): Promise<IContext | undefined> {
    const config = await cosmiconfig("release").search();
    if (config == null || config.isEmpty) {
        throw new Error("Failed to load config because file does not exist or is empty");
    }

    const branchName = process.env.GITHUB_BASE_REF || requireEnvVar("GITHUB_REF").replace(/^refs\/heads\//, "");
    const micromatch = require("micromatch");
    const branch = config.config.branches.find((branch: any) => micromatch.isMatch(branchName, branch.name));
    if (branch == null) {
        return;
    }
    if (branch.tag == null) {
        branch.tag = (branchName === "main" || branchName === "master") ? "latest" : branchName;
    }

    const eventPath: string = requireEnvVar("GITHUB_EVENT_PATH");
    const eventData = JSON.parse(fs.readFileSync(eventPath).toString());

    const [owner, repo] = requireEnvVar("GITHUB_REPOSITORY").split("/", 2);

    const publishConfig: any = {};
    for (const pc of config.config.publishConfig) {
        if (typeof pc === "string") {
            publishConfig[pc] = {};
        } else {
            publishConfig[pc[0]] = pc[1];
        }
    }

    return {
        branch,
        eventData,
        git: {
            commitSha: requireEnvVar("GITHUB_SHA"),
            committer: {
                name: core.getInput("git-committer-name"),
                email: core.getInput("git-committer-email")
            },
            repository: { owner, repo }
        },
        isMonorepo: fs.existsSync("lerna.json"),
        publishConfig
    };
}

// https://github.com/actions/toolkit/pull/814
export async function getExecOutput(commandLine: string, args?: string[], options?: exec.ExecOptions):
        Promise<{ exitCode: number, stdout: string, stderr: string }> {
    let stdout = "";
    let stderr = "";
  
    //Using string decoder covers the case where a mult-byte character is split
    const stdoutDecoder = new StringDecoder("utf8");
    const stderrDecoder = new StringDecoder("utf8");
  
    const originalStdoutListener = options?.listeners?.stdout;
    const originalStdErrListener = options?.listeners?.stderr;
  
    const stdErrListener = (data: Buffer): void => {
        stderr += stderrDecoder.write(data);
        if (originalStdErrListener) {
            originalStdErrListener(data);
        }
    }
  
    const stdOutListener = (data: Buffer): void => {
        stdout += stdoutDecoder.write(data);
        if (originalStdoutListener) {
            originalStdoutListener(data);
        }
    }
  
    const listeners = {
        ...options?.listeners,
        stdout: stdOutListener,
        stderr: stdErrListener
    };

    const exitCode = await exec.exec(commandLine, args, {...options, listeners});
  
    //flush any remaining characters
    stdout += stdoutDecoder.end();
    stderr += stderrDecoder.end();
  
    return { exitCode, stdout, stderr };
}
