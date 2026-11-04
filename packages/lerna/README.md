# Lerna plugin

[Octorelease](https://github.com/zowe-actions/octorelease) plugin for versioning and publishing packages in a Lerna workspace.

[![Build Status](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml)
[![Latest GitHub tag](https://img.shields.io/github/v/tag/zowe-actions/octorelease?sort=date&label=tag)](https://github.com/zowe-actions/octorelease/tags)

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
| `packageTagFormat` | Package tag template, used for both discovery and creation. Requires `versionIndependent: true`. Supports `{{name}}` (full name), `{{shortName}}` (without scope), and `{{version}}`. | `"{{shortName}}-{{version}}"` |

With `versionIndependent: true`, each package is compared with its own latest
stable tag reachable from HEAD. Both annotated and lightweight tags are supported.
Lerna selects changed packages and affected dependents; private packages are
excluded, and a package without a matching tag is treated as a first release.
On prerelease branches, Octorelease appends the branch's
prerelease suffix to each package's base version. For example, packages at `1.0.0`
and `0.1.0` become `1.0.0-next.YYYYMMDDHHmm` and `0.1.0-next.YYYYMMDDHHmm` on a
`next` prerelease branch. Existing prerelease suffixes are replaced. These snapshots
do not create release commits, Git tags, GitHub Releases, or versioned changelog
entries, even when the Git, GitHub, and changelog plugins are configured.
Publishing a snapshot does not advance the stable-tag baseline, so a changed
package can receive another snapshot on a subsequent push.

On stable branches, package versions must be prepared in their manifests before
release; this mode does not calculate version bumps. A changed package must have
a version greater than its previous stable release. The shared release version
(including the `new-version` input) does not override package versions. Root and
existing `lerna.json` versions are left unchanged. A temporary `lerna.json`, when
needed, uses `"version": "independent"`.

For stable releases, configure the plugins in this order:

```json
{
  "plugins": [
    ["@octorelease/lerna", {
      "versionIndependent": true
    }],
    "@octorelease/changelog",
    "@octorelease/git",
    ["@octorelease/github", { "publishRelease": true }]
  ]
}
```

This example creates tags such as `core-1.1.0` and `exec-0.2.0`. Use
`{{shortName}}-v{{version}}` for npm/cli-style tags or `{{name}}@{{version}}` for Lerna-style
`@octorelease/core@1.1.0` tags. The format must identify a package and contain
exactly one `{{version}}`; duplicate package tag namespaces are rejected.
Keep the format consistent with existing release tags. It is independent of
the shared `tagPrefix` used for action releases.

The Git plugin commits the prepared manifests and changelogs once, then creates
all package tags at that same SHA. The GitHub plugin creates a release per package
using its tag and changelog, without replacing the action's latest GitHub Release.
Its configured assets are attached to each package release. As with the existing
pipeline, Git tags are pushed in the version stage before package publication;
rerunning at the tagged release commit retries that batch. Existing tags pointing
to another commit are never moved. Shared PR-label version bumps do not apply to
independent packages.

Internal dependency ranges are updated during versioning, but peer ranges remain
as declared and must accept the published versions. For example, `^1.0.0-next`
accepts `1.0.0-next` snapshots and stable 1.x releases, but must be updated to accept
snapshots with another base such as `1.1.0-next`.

The array form retains its existing behavior: listed packages receive the shared
release's major/minor/patch bump relative to their own versions, while unlisted
packages use the shared version. Run the `version` stage before `publish` in the
`true` mode, because versioning records which packages should be published.

- Independent versioning updates changed packages and their dependent version ranges.
- Private packages are not published to npm.
- If no packages are found, run `npx lerna list --all --json` and check workspace globs.
- Dry runs can update manifests, lockfiles, and temporary configuration. Use a disposable checkout.
