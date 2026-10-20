# Lerna plugin

[Octorelease](https://github.com/zowe-actions/octorelease) plugin for versioning and publishing packages in a Lerna workspace.

[![Test](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml/badge.svg)](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/@octorelease/lerna/latest.svg)](https://www.npmjs.com/package/@octorelease/lerna)

| Stage | Behavior |
| --- | --- |
| `init` | Discover packages, read the workspace version, and configure npm authentication. |
| `version` | Update package versions and the workspace lockfile. |
| `publish` | Package workspace members and publish eligible packages through the npm plugin. |
| `success` | Optionally test installation of published packages. |

## Requirements

- [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces/) require npm 7 or newer.
- This plugin requires **npm 8.5 or newer** to refresh the npm lockfile.
- Install a Lerna version compatible with your project.

Declare workspace paths in the root `package.json`:

```json
{
  "name": "example-workspace",
  "private": true,
  "version": "1.0.0",
  "workspaces": ["packages/*"]
}
```

- Each workspace package needs a `package.json`.
- Set a fixed semantic version in `lerna.json`. If the file is absent, the plugin creates a temporary one from the root package version.
- Use `versionIndependent` for selected packages with independent versions.

## Install and use

For the CLI, install core, this plugin, and your project's chosen Lerna version:

```sh
npm install --save-dev @octorelease/core @octorelease/lerna lerna
```

The GitHub Action bundles the Octorelease plugin; your release project still needs Lerna tooling. Configure the plugin in your [release configuration](https://github.com/zowe-actions/octorelease/blob/master/docs/usage.md#configuration):

```json
{
  "branches": ["main"],
  "plugins": [
    "@octorelease/changelog",
    ["@octorelease/lerna", { "smokeTest": true }],
    ["@octorelease/github", { "publishRelease": true }],
    "@octorelease/git"
  ]
}
```

- Run from the workspace root with full Git history.
- Use this plugin in place of `@octorelease/npm`; it handles npm publishing for workspace members.
- Supply npm, GitHub, and Git credentials as shown in the [workflow guide](https://github.com/zowe-actions/octorelease/blob/master/docs/usage.md#workflow-configuration).

## Configuration

The plugin accepts the [npm plugin options and credentials](https://github.com/zowe-actions/octorelease/blob/master/packages/npm/README.md#configuration), with these additions:

| Option | Description | Default |
| --- | --- | --- |
| `pruneShrinkwrap` | Boolean or list of workspace package names whose `npm-shrinkwrap.json` should be pruned before packaging. | Disabled |
| `versionIndependent` | Package names that receive their own version increments alongside the fixed workspace version. Names refer to `package.json` names, not directory paths. | Unset |

- Independent versioning updates changed packages and their dependent version ranges.
- Private packages are not published to npm.
- If no packages are found, run `npx lerna list --all --json` and check workspace globs.
- Dry runs can update manifests, lockfiles, and temporary configuration. Use a disposable checkout.
