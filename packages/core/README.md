# Octorelease core

CLI and plugin APIs for [Octorelease](https://github.com/zowe-actions/octorelease), a configurable release workflow for CI.

[![Test](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml/badge.svg)](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/@octorelease/core/latest.svg)](https://www.npmjs.com/package/@octorelease/core)

## Install

```sh
npm install --save-dev @octorelease/core
```

- Run in CI with Node.js, npm, and Git.
- Install additional plugins in the release project.
- Include core's optional dependencies if you use changelog, Git, GitHub, or npm plugins.

GitHub Actions users can use `zowe-actions/octorelease@v1` without installing core. See the [complete workflow](https://github.com/zowe-actions/octorelease/blob/master/docs/usage.md#workflow-configuration).

## Usage

Run from the project root in CI, after the project build and tests:

```sh
npx octorelease
```

The executable reads environment inputs rather than command-line flags. For a dry run with an explicit version on a POSIX runner:

```sh
env 'INPUT_DRY-RUN=true' 'INPUT_NEW-VERSION=1.2.3' npx octorelease
```

Supply credentials for the configured plugins even during a dry run. Local version files, Git commits, and tags can still change; use a disposable checkout. See [inputs and dry-run behavior](https://github.com/zowe-actions/octorelease/blob/master/docs/usage.md#action-inputs).

## Configuration

Create `.releaserc.json` in the release project:

```json
{
  "branches": ["main"],
  "plugins": [
    "@octorelease/changelog",
    "@octorelease/npm",
    ["@octorelease/github", { "publishRelease": true }],
    "@octorelease/git"
  ]
}
```

- Replace `main` with your release branch.
- Add notes under `## Recent Changes` in `CHANGELOG.md`.
- Supply `NPM_TOKEN`, `GITHUB_TOKEN`, `GIT_COMMITTER_NAME`, and `GIT_COMMITTER_EMAIL`.
- Allow Git to push the version commit and tag.
- Put Git after plugins that update release files.

`branches` is required. Plugins must be listed explicitly. See the [configuration reference](https://github.com/zowe-actions/octorelease/blob/master/docs/usage.md#configuration) for all options.

## Stages

| Stage | Core behavior |
| --- | --- |
| `init` | Run initialization handlers, then finalize and validate the version. Cannot be skipped. |
| `version` | Run handlers that prepare version files, changelogs, commits, and tags. |
| `publish` | Run handlers that distribute packages and release assets. |
| `success` | Run follow-up handlers after successful publishing. |
| `fail` | Run error handlers when initialization, validation, or a later stage throws. |

Core coordinates the stages; the configured plugins perform those operations. It does not analyze commit messages to choose a version.

## Plugin API

```js
const { Logger, stages, utils } = require("@octorelease/core");
```

TypeScript consumers can also import contracts such as `IContext` and `IPlugin`. Start with the [plugin tutorial](https://github.com/zowe-actions/octorelease/blob/master/docs/developer-guide.md#writing-a-plugin), then use the [API reference](https://github.com/zowe-actions/octorelease/blob/master/docs/typedoc/globals.md) for signatures and return types.
