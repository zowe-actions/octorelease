import * as fs from "fs";
import * as exec from "@actions/exec";
import { execAndReturnOutput } from "./core";
import { IPackageInfo } from "../doc/IPackageInfo";

export async function lernaList(onlyChanged: boolean): Promise<IPackageInfo[]> {
    const lernaCmd = onlyChanged ? "changed" : "list";
    const cmdOutput = await execAndReturnOutput("lerna", [lernaCmd, "--long", "--toposort", "--loglevel silent"]);
    const packageInfo: IPackageInfo[] = [];

    for (const line of cmdOutput.trim().split("\n")) {
        const [ name, version, path ] = line.split(/\s+/, 3);
        packageInfo.push({
            name, path,
            version: version.slice(1)
        });
    }

    return packageInfo;
}

export async function lernaVersion(newVersion: string): Promise<string> {
    await exec.exec(`lerna version ${newVersion} --exact --no-git-tag-version -y --loglevel silent`);
    return JSON.parse(fs.readFileSync("lerna.json", "utf-8")).version;
}
