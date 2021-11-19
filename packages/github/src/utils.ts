import * as github from "@actions/github";
import { GitHub, getOctokitOptions } from "@actions/github/lib/utils";
import { enterpriseServer30 } from "@octokit/plugin-enterprise-server";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";

export function getOctokit(context: IContext, config: IPluginConfig): InstanceType<typeof GitHub> {
    if (config.githubUrl != null) {
        const octokit = GitHub.plugin(enterpriseServer30);
        const githubUrl = config.githubUrl.endsWith("/") ? config.githubUrl : (config.githubUrl + "/");
        return new octokit(getOctokitOptions(context.env.GITHUB_TOKEN, {
            baseUrl: githubUrl + "api/v3"
        }));
    }

    return github.getOctokit(context.env.GITHUB_TOKEN);
}
