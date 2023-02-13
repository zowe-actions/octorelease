# Lerna plugin

[Octorelease](https://github.com/octorelease/octorelease) plugin to perform actions related to NPM for Lerna monorepo.

[![Build Status](https://github.com/octorelease/lerna/workflows/Test/badge.svg)](https://github.com/octorelease/lerna/actions?query=workflow%3ATest+branch%3Amaster)
[![npm latest version](https://img.shields.io/npm/v/@octorelease/lerna/latest.svg)](https://www.npmjs.com/package/@octorelease/lerna)
<!-- [![npm next version](https://img.shields.io/npm/v/@octorelease/lerna/next.svg)](https://www.npmjs.com/package/@octorelease/lerna) -->

| Step | Description |
|------|-------------|
| `init` | Load version numbers from lerna.json and login to NPM registry. |
| `version` | Bump changed package versions with lerna CLI. |
| `publish` | Publish the new package versions to NPM registry. |
| `success` | Verify that new package versions can be installed successfully. |

## Install

```bash
$ npm install @octorelease/lerna -D
```

## Usage

The plugin can be configured in the [Octorelease configuration file](https://github.com/octorelease/octorelease/blob/master/docs/usage.md#configuration):

```json
{
  "plugins": [
    "@octorelease/lerna"
  ]
}
```

## Configuration

See the documentation for [@octorelease/npm](https://github.com/octorelease/octorelease/tree/master/packages/npm#configuration).

<!-- TODO Mention npm@7 or newer requirement for workspaces -->
