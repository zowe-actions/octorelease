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

If neither token nor legacy credentials are supplied, the plugin automatically uses [npm OIDC trusted publishing](https://docs.npmjs.com/trusted-publishers/) when publishing to npmjs.org and an OIDC environment is available. No plugin option is required. GitHub Actions provides this environment with `id-token: write`; providers that supply `NPM_ID_TOKEN` are also detected. An empty `NPM_TOKEN` is treated as absent. Existing credential authentication is retained when credentials are supplied.

For GitHub Actions:

1. Configure a trusted publisher in each npm package's settings with your GitHub owner, repository, workflow filename, and optional environment. Allow both `npm publish` and `npm dist-tag`, since Octorelease updates release and alias tags after publishing. Ensure each package's `repository.url` matches the publishing repository.
2. Use a GitHub-hosted runner with Node.js 22.14.0 or newer and npm 11.21.0+ on the 11.x line, or npm 12.2.0+. The plugin checks the npm version before publishing because older versions do not support OIDC tag updates.
3. Add `id-token: write` to the publishing job's permissions alongside the permissions required by your other plugins, and remove `NPM_TOKEN` from the release step.

```yaml
jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - run: npm install --global npm@11
      - run: npm ci
      - uses: zowe-actions/octorelease@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

In OIDC mode the plugin does not write publishing credentials to `.npmrc` or run `npm whoami`. The npm CLI exchanges the CI identity for short-lived credentials during publishing and tag updates. `npm publish --dry-run` attempts the OIDC exchange, but missing authentication produces a warning instead of an authentication error, so a successful dry-run exit code does not prove trusted publishing works. Private dependency installation and private package lookups still require separate read credentials; OIDC does not authenticate those operations. Other registries and environments without OIDC still require the existing credentials.

### Options

| Options | Description | Default |
| ------- | ----------- | ------- |
| `aliasTags` | Key-value pairs of package tags that should be mirrored (see example below). | `{}` |
| `npmPublish` | Specify false to skip publishing to the NPM registry. | `true` |
| `publishRegistry` | NPM registry URL where the package should be published. | `publishConfig.registry` in package.json |
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
