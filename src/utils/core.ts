import * as fs from "fs";
import { StringDecoder } from "string_decoder";
import * as exec from "@actions/exec";
import * as github from "@actions/github";
import { cosmiconfig } from "cosmiconfig";
import { IContext } from "../doc/IContext";

export async function buildContext(): Promise<IContext | undefined> {
    const config = await cosmiconfig("release").search();
    if (config == null || config.isEmpty) {
        throw new Error("Failed to load config because file does not exist or is empty");
    }

    const branchName = github.context.payload.pull_request?.base.ref || github.context.ref.replace(/^refs\/heads\//, "");
    const micromatch = require("micromatch");
    const branch = config.config.branches
        .map((branch: any) => typeof branch === "string" ? { name: branch } : branch)
        .find((branch: any) => micromatch.isMatch(branchName, branch.name));
    if (branch == null) {
        return;
    }
    if (branch.tag == null) {
        branch.tag = ["main", "master"].includes(branchName) ? "latest" : branchName;
    }

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
