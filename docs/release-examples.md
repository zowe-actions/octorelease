# Release examples

[Usage](usage.md) · [Plugin catalog](extending.md) · [Maintainer guide](maintainer-guide.md)

A release is a delivery: choose a version, prepare the files, and send each package to the right place. Octorelease coordinates the work; plugins do each job.

Three terms help when reading the configurations:

- **Registry:** a service where users download packages.
- **Channel:** a label, such as `latest`, that points users to a version.
- **Artifact:** a file produced by the build, such as an npm tarball or VS Code extension.

These examples explain specific repository configurations. The source links point to the revisions used for this guide; consult each project's branch for later changes.

For maintainer steps, jump to [release a sample plugin](#release-a-sample-plugin), [release Zowe CLI](#release-zowe-cli), [retry a CLI or sample plugin release](#retry-a-cli-or-sample-plugin-release), or [release Zowe Explorer](#release-zowe-explorer).

## 1. Zowe CLI sample plugin: one package

**Goal:** publish one plugin that users can install into Zowe CLI.

Sources: [release configuration](https://github.com/zowe/zowe-cli-sample-plugin/blob/b7e2cfc19bd7bb200b2b5b875f67ada2e32e0a82/release.config.js), [workflow](https://github.com/zowe/zowe-cli-sample-plugin/blob/b7e2cfc19bd7bb200b2b5b875f67ada2e32e0a82/.github/workflows/zowe-cli-plugin.yml), and [package metadata](https://github.com/zowe/zowe-cli-sample-plugin/blob/b7e2cfc19bd7bb200b2b5b875f67ada2e32e0a82/package.json).

### What happens

1. The workflow builds and tests the project. The release job waits for the test job and runs on pushes to protected branches.
2. npm reads the package version. GitHub checks the merged PR for an approved release label.
3. Changelog updates the release notes; npm updates the package version; Git commits and tags the changes.
4. npm publishes the package to the JFrog registry configured in `package.json`.
5. The success handlers test package installation and update the PR.

### What the options mean

- `master` permits up to minor bumps; `zowe-v?-lts` branches permit patch bumps.
- `checkPrLabels: true` asks GitHub to use release labels to choose the bump.
- `aliasTags` points `zowe-v2-lts` and `next` at the version published as `latest`. These are extra labels for the same package version.
- `smokeTest: true` checks that the published package can be installed.

The GitHub plugin is used for release approval and PR feedback here. This configuration does not request a GitHub release page or asset uploads.

### Release a sample plugin

1. Include release notes under `## Recent Changes` in `CHANGELOG.md`, then merge the PR into a protected release branch listed above.
2. Open **Actions → zowe-cli-plugin** and find the merge's **push** run. The `release` job starts after tests pass.
3. Have a repository admin add one [release label](#choose-a-release-label), such as `release-patch`, to the merged PR. If Octorelease requests approval, respond within 30 minutes.
4. Verify the package version in JFrog and check the logs, PR comment, and `released` label.

For a failed or timed-out attempt, follow [the shared CLI retry steps](#retry-a-cli-or-sample-plugin-release), using the `zowe-cli-plugin` workflow and `package.json` as the version source.

**Takeaway:** one package needs one publishing plugin, plus changelog, Git, and GitHub support.

## 2. Zowe CLI: a family of packages

**Goal:** release the CLI and its related SDK packages from one repository.

Sources: [release configuration](https://github.com/zowe/zowe-cli/blob/f4ae70e5e30ecc227dd34e04825a7ff6268441ed/release.config.js), [workspace configuration](https://github.com/zowe/zowe-cli/blob/f4ae70e5e30ecc227dd34e04825a7ff6268441ed/lerna.json), and [workflow](https://github.com/zowe/zowe-cli/blob/f4ae70e5e30ecc227dd34e04825a7ff6268441ed/.github/workflows/zowe-cli.yml).

### What changes from the sample

- Lerna replaces the npm plugin to manage workspace packages together.
- `displayNames` gives each package's release notes a readable heading, such as “Core SDK.”
- `publishRegistry` sends the packages to Zowe's JFrog registry.
- `publishRelease: true` also publishes a GitHub release page.

### Follow the release

1. The workflow's release job waits for the test job and runs on a protected-branch push.
2. Lerna loads the workspace version; GitHub checks approved PR labels.
3. Changelog gathers package notes. Lerna updates versions and dependency information; Git commits and tags the result.
4. Lerna publishes through npm, and GitHub publishes the combined release notes.
5. Installation smoke tests check the published packages.

The `latest` package tag is also mirrored to `zowe-v3-lts`. As in the sample, the main release branch allows minor bumps and maintenance branches allow patch bumps.

### Release Zowe CLI

For a patch release:

1. Include release notes under `## Recent Changes` in the affected packages' changelogs, then merge the PR into a protected `master` or matching `zowe-v?-lts` branch.
2. Open **Actions → Zowe CLI** and select the merge's **push** run. The `release` job starts after tests pass.
3. Have a repository admin add `release-patch` to the merged PR. This requests `3.10.1` if the workspace version is `3.10.0`. If Octorelease requests approval, respond within 30 minutes.
4. Follow the Octorelease step, then verify the JFrog packages, GitHub release, installation smoke tests, and PR release comment and `released` label.

The merge's **push** event starts the release; the label approves it. Neither labeling alone nor **Run workflow** starts a release: the `release` job requires a push event.

### Choose a release label

For both repositories, a repository **admin must apply exactly one label after merging**. Earlier labels or labels from non-admins do not count; remove them and have an admin reapply after merging.

| Label | From `3.10.0` | When to use it |
| --- | --- | --- |
| `release-current` | `3.10.0` | Publish the prepared version, including retries after a committed bump. |
| `release-patch` | `3.10.1` | Patch on `master` or a configured LTS branch. |
| `release-minor` | `3.11.0` | Minor release on `master`. |
| `release-major` | `4.0.0` | Requires changing these configurations' branch limits first. |

The [GitHub plugin](../packages/github/README.md) selects the version from the label and current branch version; Octorelease enforces branch limits. `release-current` still publishes but does not overwrite.

### Retry a CLI or sample plugin release

1. Open the merge's original **push** run in **Actions**, or follow the PR failure comment's link. Fix the first failure, such as an expired credential.
2. Check completed work: the branch's version commit, Git tag, registry packages, and GitHub release. Read `lerna.json` for CLI or `package.json` for the sample plugin. Reassess any source changes or subsequent releases before retrying.
3. Preserve the **original intended version**. To finish `3.10.1`, choose `release-patch` if the branch still has `3.10.0`, or `release-current` if it already has `3.10.1`. Replace any stale bump label before rerunning.
4. Select **Re-run jobs → Re-run failed jobs**. After a successful run without the intended release (for example, an approval timeout), use **Re-run all jobs** or rerun `release` from its job menu. See [GitHub's rerun instructions](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs).
5. Have an admin reapply the chosen label if missing: the failure handler removes release labels. Respond to any approval request within 30 minutes. If `released` is present, inspect publication first; it suppresses a new bump.
6. Verify the intended version in each destination and check the logs. Recovery may not post a fresh success comment if everything was already published.

**Why check the branch version?** Reruns retain the original event's `GITHUB_SHA` and `GITHUB_REF`, but these jobs check out the branch again with `ref: ${{ github.ref }}`. A previously committed bump is therefore included: applying `release-patch` to `3.10.1` would request `3.10.2`.

No new PR is needed solely to retry. Octorelease revisits its stages and checks completed operations without rolling back earlier publications. See [Recovering a partial release](support.md#recovering-a-partial-release).

**Takeaway:** the release stages stay the same. Lerna handles several packages where the sample used npm for one.

## 3. Zowe Explorer: different packages, different destinations

**Goal:** release a TypeScript API package and two VS Code extensions together.

Sources: [release configuration](https://github.com/zowe/zowe-explorer-vscode/blob/8e6b78ef925d09dc477b22961338437fa338db7e/.github/release.config.js) and [deployment workflow](https://github.com/zowe/zowe-explorer-vscode/blob/8e6b78ef925d09dc477b22961338437fa338db7e/.github/workflows/deployment.yml).

### Divide the work

- **Changelog:** reads notes under `## TBD Release` and names each package's section.
- **Lerna:** coordinates workspace versions. `npmPublish: false` leaves registry publication to the other entries.
- **npm:** works in `packages/zowe-explorer-api` and publishes the API package.
- **VSCE:** runs once for Zowe Explorer and once for the FTP extension. Both go to the VS Code Marketplace and Open VSX.
- **GitHub:** collects `.tgz` and `.vsix` files from `dist` into a draft release.
- **Git:** commits and tags the prepared changes.

`$cwd` tells a plugin which package directory to work in. The two VSCE option objects are two jobs for the same plugin, not two different plugins.

### Follow the release

1. The deployment workflow builds the project and downloads translations.
2. It skips Octorelease when the selected version contains `-SNAPSHOT`. A manual workflow input can supply the release version.
3. Octorelease prepares versions and notes, then publishes each artifact through its assigned plugin.
4. After success, the workflow adds fresh changelog headings and invokes `prepareRelease` to prepare the next snapshot version.

This workflow uses the workspace version or explicit input; it does not enable PR-label version selection. GitHub assets remain in a draft release because `publishRelease` is not enabled.

### Release Zowe Explorer

For an automatic release, merge a PR setting the intended version in `lerna.json` into a protected release branch. Pushes only trigger deployment when they change `lerna.json`, `.github/release.config.js`, or `.github/workflows/deployment.yml`. Without an override, the version comes from `lerna.json`. A selected version containing `-SNAPSHOT` skips Octorelease. No release label is required.

For a manual release:

1. Prepare changes and package notes under `## TBD Release` on `main`, `v1-lts`, `v2-lts`, or a matching `release/3.*` branch.
2. As a repository admin, open **Actions → Deployment of Zowe Explorer and related extensions → Run workflow** and select the branch.
3. Enter the intended version, such as `3.10.1`, in **Override version to be published** (Octorelease's `new-version`). LTS branches permit patch bumps; `main` and `release/3.*` permit up to minor.
4. Run the workflow. Verify the npm API package, both extensions in Marketplace and Open VSX, and `.tgz`/`.vsix` assets in the GitHub draft. Review the draft before publishing it, and check the subsequent changelog and snapshot updates.

### Retry a Zowe Explorer release

1. Inspect the failed step and existing versions in npm, both extension registries, and the GitHub draft. Fix the cause.
2. Preserve the original release version. Reruns retain explicit version inputs; without one, they read the branch's `lerna.json` again. If it now contains a snapshot, an admin can dispatch with the original version after verifying the branch contents and version limits.
3. If only **Update Changelogs** or **Create Snapshot Version** failed, inspect their changes before rerunning: publication may be complete, and these steps can repeat edits.
4. Choose **Re-run failed jobs** on the original run, or dispatch with the explicit version if needed, then verify the remaining work completed.

See [Recovering a partial release](support.md#recovering-a-partial-release) for general recovery checks.

**Takeaway:** separate version coordination from delivery when one repository produces different kinds of packages.

## Reading another release configuration

Ask these questions in order:

1. **When does it run?** Read the workflow trigger and job conditions.
2. **Which branches can release?** Read `branches`, `level`, and `channel`.
3. **Who chooses the version?** Look for package metadata, PR-label checks, or `new-version`.
4. **What gets prepared?** Follow the `version` handlers in plugin order.
5. **Where does it go?** Check registry options, `$cwd`, and asset paths.
6. **What happens afterward?** Read success handlers and later workflow steps.

A plugin list is reused at every stage. For example, Git can appear last in the list yet create the version commit before npm publishes, because `version` runs before `publish`.
