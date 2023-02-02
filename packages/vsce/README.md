# NPM plugin

[Octorelease](https://github.com/octorelease/octorelease) plugin to perform actions related to NPM.

[![Build Status](https://github.com/octorelease/octorelease/workflows/Test/badge.svg)](https://github.com/octorelease/octorelease/actions?query=workflow%3ATest+branch%3Amaster)
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

The plugin can be configured in the [Octorelease configuration file](https://github.com/octorelease/octorelease/blob/master/docs/usage.md#configuration):

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

| Options | Description | Default |
| ------- | ----------- | ------- |
| `aliasTags` | Key-value pairs of package tags that should be mirrored (see example below). | `{}` |
| `npmPublish` | Specify false to skip publishing to the NPM registry. | `true` |
| `pruneShrinkwrap` | Specify true to prune dev and extraneous dependencies from npm-shrinkwrap.json. | `false` |
| `smokeTest` | Specify true to test installing the package from the NPM registry after it is published. | `false` |
| `tarballDir` | Path to directory where package tarball (TGZ) should be generated, or `false` to skip creating a tarball. | `false` |

### Examples

To mirror the `@latest` tag to `@lts`:

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
To skip publishing to the NPM registry and release the package tarball with another plugin like [@octorelease/github](https://github.com/octorelease/octorelease/tree/master/packages/github):

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
