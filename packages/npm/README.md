# NPM plugin

[Octorelease](https://github.com/zowe-actions/octorelease) plugin to version, package, and publish npm packages.

[![Build Status](https://github.com/zowe-actions/octorelease/workflows/Test/badge.svg)](https://github.com/zowe-actions/octorelease/actions?query=workflow%3ATest+branch%3Amaster)
[![npm latest version](https://img.shields.io/npm/v/@octorelease/npm/latest.svg)](https://www.npmjs.com/package/@octorelease/npm)
<!-- [![npm next version](https://img.shields.io/npm/v/@octorelease/npm/next.svg)](https://www.npmjs.com/package/@octorelease/npm) -->

| Step | Description |
|------|-------------|
| `init` | Load version numbers from package.json and login to NPM registry. |
| `version` | Bump the package version with npm CLI. |
| `publish` | Publish the new package version to NPM registry. |
| `success` | Verify that new package version can be installed successfully. |

## Install

```bash
$ npm install @octorelease/npm -D
```

## Usage

Add this plugin to your [release configuration](https://github.com/zowe-actions/octorelease/blob/master/docs/usage.md#configuration):

```json
{
  "plugins": [
    "@octorelease/npm"
  ]
}
```

## Configuration

### Environment variables

| Variable | Description |
| -------- | ----------- |
| `NPM_TOKEN` | Access token of the NPM publisher. |
| `NPM_USERNAME` | User name of the NPM publisher. |
| `NPM_PASSWORD` | Password of the NPM publisher. |
| `NPM_EMAIL` | Email address of the NPM publisher. |

Use either `NPM_TOKEN` for token authentication or `NPM_USERNAME`, `NPM_PASSWORD`, and `NPM_EMAIL` for legacy authentication.

### Options

| Option | Description | Default |
| ------- | ----------- | ------- |
| `aliasTags` | Key-value pairs of package tags that should be mirrored (see example below). | `{}` |
| `npmPublish` | Set `false` to skip publishing to the NPM registry. | `true` |
| `publishRegistry` | NPM registry URL where the package should be published. | `publishConfig.registry` in package.json |
| `pruneShrinkwrap` | Set `true` to prune dev and extraneous dependencies from npm-shrinkwrap.json. | `false` |
| `smokeTest` | Set `true` to test installing the package from the NPM registry after it is published. | `false` |
| `tarballDir` | Directory to copy the generated package tarball (TGZ) into, relative to the release root. A tarball is still created when this option is omitted. | Unset |

### Examples

Mirror the `latest` tag to `lts`:

```json
{
  "plugins": [
    ["@octorelease/npm", {
      "aliasTags": {
        "latest": "lts"
      }
    }]
  ]
}
```

---
To skip publishing to the NPM registry and release the package tarball with another plugin like [@octorelease/github](https://github.com/zowe-actions/octorelease/tree/master/packages/github):

```json
{
  "plugins": [
    ["@octorelease/npm", {
      "npmPublish": false,
      "tarballDir": "dist"
    }],
    ["@octorelease/github", {
      "assets": "dist/*.tgz"
    }]
  ]
}
```
