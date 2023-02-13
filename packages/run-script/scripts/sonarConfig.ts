/**
 * Copyright 2022 Octorelease Contributors
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
import * as github from "@actions/github";
import { IContext } from "@octorelease/core";
import * as properties from "java-properties";
import * as utils from "../src/utils";

async function downloadCoverageReports(context: IContext) {
    // For GHA workflows triggered by workflow_run event, download coverage artifact from the triggering workflow
    if (context.ci.service as any !== "github" || process.env.COVERAGE_ARTIFACT == null) {
        return;
    }
    const [artifactName, extractPath] = process.env.COVERAGE_ARTIFACT.split(":", 2);
    await utils.downloadArtifact(github.context.payload.workflow_run.id, artifactName, extractPath);
}

function getPrHeadRef(pr: any) {
    // Prepend repo owner to PR branch name if it comes from a fork
    if (pr.base.repo.full_name === pr.head.repo.full_name) {
        return pr.head.ref;
    } else {
        return `${pr.head.repo.full_name.split("/")[0]}:${pr.head.ref}`;
    }
}

function rewriteCoverageReports(context: IContext) {
    // Workaround for https://community.sonarsource.com/t/code-coverage-doesnt-work-with-github-action/16747
    if (context.ci.service as any !== "github") {
        return;
    }
    const sonarProps = properties.of("sonar-project.properties");
    const reportPaths = sonarProps.get("sonar.javascript.lcov.reportPaths");
    if (typeof reportPaths !== "string") {
        return;
    }
    context.logger.info("Fixing coverage paths for SonarCloud");
    const pattern = new RegExp(context.env.GITHUB_WORKSPACE, "g");
    for (const reportPath of reportPaths.split(",")) {
        const reportText = fs.readFileSync(reportPath, "utf-8");
        fs.writeFileSync(reportPath, reportText.replace(pattern, "/github/workspace"));
    }
}

export default async function (context: IContext): Promise<void> {
    // Append Sonar properties to the sonar-project.properties file
    const sonarProps: { [key: string]: any } = {};
    const packageJson = JSON.parse(fs.readFileSync(fs.existsSync("lerna.json") ? "lerna.json"
        : "package.json", "utf-8"));
    sonarProps["sonar.projectVersion"] = packageJson.version;
    sonarProps["sonar.links.ci"] =
        `https://github.com/${(context.ci as any).slug}/actions/runs/${(context.ci as any).build}`;
    if (github.context.payload.workflow_run != null) {
        sonarProps["sonar.scm.revision"] = github.context.payload.workflow_run.head_sha;
    }

    // Set properties for pull request or branch scanning
    const pr = await utils.findCurrentPr();
    if (pr != null) {
        sonarProps["sonar.pullrequest.key"] = pr.number;
        sonarProps["sonar.pullrequest.branch"] = getPrHeadRef(pr);
        sonarProps["sonar.pullrequest.base"] = pr.base.ref;
    } else {
        sonarProps["sonar.branch.name"] = github.context.payload.workflow_run?.head_branch ??
            context.ci.branch as string;
    }

    // Convert properties to argument string and store it in output
    context.logger.info("Sonar scan properties:\n" + JSON.stringify(sonarProps, null, 2));
    fs.appendFileSync("sonar-project.properties", Object.entries(sonarProps).map(([k, v]) => `${k}=${v}`).join("\n"));
    await downloadCoverageReports(context);
    rewriteCoverageReports(context);
}
