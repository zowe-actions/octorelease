/**
 * Copyright 2020-2023 Zowe Actions Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as exec from "@actions/exec";
import { IContext, utils } from "@octorelease/core";

export async function npmAddTag(context: IContext, pkgSpec: string, tag: string, registry: string,
        inDir?: string): Promise<void> {
    const cmdArgs = ["dist-tag", "add", pkgSpec, tag, "--registry", registry];
    await utils.dryRunTask(context, `npm ${cmdArgs.join(" ")}`, async () => {
        await exec.exec("npm", cmdArgs, { cwd: inDir });
    });
}

export async function npmConfig(context: IContext, registry: string, useTokenAuth = true): Promise<void> {
    const npmrcLines: string[] = [];
    // Add trailing slash to end of registry URL and remove protocol at start
    const registrySpec = (registry.endsWith("/") ? registry : (registry + "/")).replace(/^\w+:/, "");
    if (useTokenAuth) {
        npmrcLines.push(`${registrySpec}:_authToken=${context.env.NPM_TOKEN}`);
    } else {
        const b64Auth = Buffer.from(`${context.env.NPM_USERNAME}:${context.env.NPM_PASSWORD}`).toString("base64");
        npmrcLines.push(`${registrySpec}:_auth=${b64Auth}`);
        npmrcLines.push(`${registrySpec}:email=${context.env.NPM_EMAIL}`);
    }
    fs.appendFileSync(path.join(os.homedir(), ".npmrc"), npmrcLines.join("\n"));
    await exec.exec("npm", ["whoami", "--registry", registry]);
}

export async function npmInstall(pkgSpec: string, registry: string, inDir?: string): Promise<void> {
    const registryPrefix = pkgSpec.startsWith("@") ? `${pkgSpec.split("/")[0]}:` : "";
    await exec.exec("npm", ["install", pkgSpec, `--${registryPrefix}registry=${registry}`], { cwd: inDir });
}

export async function npmPack(inDir?: string): Promise<string> {
    const cmdOutput = await exec.getExecOutput("npm", ["pack"], { cwd: inDir });
    return cmdOutput.stdout.trim().split(/\s+/).pop() as string;
}

export async function npmPublish(context: IContext, tag: string, registry: string, inDir?: string): Promise<void> {
    const cmdArgs = ["publish", "--tag", tag, "--registry", registry];
    if (context.dryRun) {
        cmdArgs.push("--dry-run");
    }
    await exec.exec("npm", cmdArgs, { cwd: inDir });
}

export async function npmVersion(newVersion: string): Promise<void> {
    await exec.exec("npm", ["version", newVersion, "--allow-same-version", "--no-git-tag-version"]);
}

export async function npmView(pkgSpec: string, registry: string, property?: string): Promise<any> {
    const registryPrefix = pkgSpec.startsWith("@") ? `${pkgSpec.split("/")[0]}:` : "";
    const cmdArgs = ["view", `${pkgSpec}`, "--json", `--${registryPrefix}registry=${registry}`];
    if (property != null) {
        cmdArgs.push(property);
    }
    try {
        const cmdOutput = await exec.getExecOutput("npm", cmdArgs);
        return JSON.parse(cmdOutput.stdout.trim());
    } catch { /* Do nothing */ }
}

export function verifyConditions(context: IContext): boolean {
    const useTokenAuth = context.env.NPM_USERNAME == null && context.env.NPM_PASSWORD == null &&
        context.env.NPM_EMAIL == null;
    if (useTokenAuth && context.env.NPM_TOKEN == null) {
        throw new Error("Required environment variable NPM_TOKEN is undefined");
    } else if (!useTokenAuth) {
        const missingEnvVars = ["NPM_USERNAME", "NPM_PASSWORD", "NPM_EMAIL"].filter(name => context.env[name] == null);
        if (missingEnvVars.length == 1) {
            throw new Error(`Required environment variable ${missingEnvVars[0]} is undefined`);
        } else if (missingEnvVars.length > 1) {
            throw new Error(`Required environment variables ${missingEnvVars.join(", ")} are undefined`);
        }
    }
    return useTokenAuth;
}
