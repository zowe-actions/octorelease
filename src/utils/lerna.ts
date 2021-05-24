import * as exec from "@actions/exec";
import { getExecOutput } from "./core";

export async function lernaList(): Promise<Record<string, any>[]> {
    const packageInfo = JSON.parse((await getExecOutput("npx", ["lerna", "list", "--json", "--toposort"])).stdout);
    const changedPackages = (await getExecOutput("npx", ["lerna", "changed", "--include-merged-tags"])).stdout.split(/\r?\n/);
    
    for (const pkg of packageInfo) {
        pkg.changed = changedPackages.includes(pkg.name);
    }

    return packageInfo;
}

export async function lernaVersion(newVersion: string): Promise<void> {
    await exec.exec("npx", ["lerna", "version", newVersion, "--exact", "--include-merged-tags", "--no-git-tag-version", "--yes"]);
}
