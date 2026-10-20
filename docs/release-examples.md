# Release examples

[Usage](usage.md) · [Plugin catalog](extending.md) · [Maintainer guide](maintainer-guide.md)

A release is a delivery: choose a version, prepare the files, and send each package to the right place. Octorelease coordinates the work; plugins do each job.

Three terms help when reading the configurations:

- **Registry:** a service where users download packages.
- **Channel:** a label, such as `latest`, that points users to a version.
- **Artifact:** a file produced by the build, such as an npm tarball or VS Code extension.

These examples explain specific repository configurations. The source links point to the revisions used for this guide; consult each project's branch for later changes.

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

**Takeaway:** the release stages stay the same. Lerna handles several packages where the sample used npm for one.

## 3. Zowe Explorer: different packages, different destinations

**Goal:** release a JavaScript API package and two VS Code extensions together.

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
