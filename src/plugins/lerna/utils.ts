import * as exec from "@actions/exec";

export async function lernaList(onlyChanged?: boolean): Promise<Record<string, any>[]> {
    let cmdOutput = await exec.getExecOutput("npx", ["lerna", "list", "--json", "--toposort"]);
    const packageInfo = JSON.parse(cmdOutput.stdout);

    if (onlyChanged) {
        try {
            cmdOutput = await exec.getExecOutput("npx", ["lerna", "changed", "--include-merged-tags"])
            const changedPackages = cmdOutput.stdout.split(/\r?\n/);
            return packageInfo.filter((pkg: any) => changedPackages.includes(pkg.name));
        } catch { /* Ignore error if there are no changed packages */ }
    }

    return packageInfo;
}

export async function lernaVersion(newVersion: string): Promise<void> {
    await exec.exec("npx", ["lerna", "version", newVersion, "--exact", "--include-merged-tags", "--no-git-tag-version", "--yes"]);
}
