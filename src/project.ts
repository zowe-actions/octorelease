import * as fs from "fs";
import * as core from "@actions/core";
import { IPackageInfo } from "./doc";
import * as utils from "./utils";

/**
 * Type of project (used for monorepos)
 */
export type ProjectType = "lerna" | "yarn-workspaces";

export class Project {
    public static changedPkgInfo: IPackageInfo[];

    public static get projectType(): ProjectType | null {
        switch (core.getInput("project-type")) {
            case "lerna":
                return "lerna";
            case "yarn-workspaces":
                throw Error("Not yet implemented");
            default:
                return null;
        }
    }

    // public static async calcAllPkgInfo(): Promise<void> {
    //     switch (this.projectType) {
    //         case "lerna":
    //             this.validateLerna();
    //             this.allPkgInfo = await utils.lernaList(false);
    //             break;
    //         default:
    //             this.allPkgInfo = [{
    //                 name: JSON.parse(fs.readFileSync("package.json", "utf-8")).name
    //             }];
    //     }
    // }

    public static async calcChangedPkgInfo(): Promise<void> {
        switch (this.projectType) {
            case "lerna":
                // TODO Remove following line once calcAllPkgInfo is implemented
                this.validateLerna();
                this.changedPkgInfo = await utils.lernaList(true);
                break;
            default:
                this.changedPkgInfo = [{
                    name: JSON.parse(fs.readFileSync("package.json", "utf-8")).name
                }];
        }
    }

    private static validateLerna(): void {
        if (!fs.existsSync("lerna.json")) {
            core.setFailed("Project type is lerna and lerna.json file not found");
            process.exit();
        }

        const lernaJson = JSON.parse(fs.readFileSync("lerna.json", "utf-8"));

        if (lernaJson.version === "independent") {
            core.setFailed("Lerna project uses independent version mode which is not supported");
            process.exit();
        }
    }
}
