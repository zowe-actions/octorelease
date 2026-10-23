# Lerna plugin

[Octorelease](https://github.com/octorelease/octorelease) plugin to perform actions related to NPM for Lerna monorepo.

[![Build Status](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml)
[![Latest GitHub tag](https://img.shields.io/github/v/tag/zowe-actions/octorelease?sort=date&label=tag)](https://github.com/zowe-actions/octorelease/tags)

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

See the documentation for [@octorelease/npm](https://github.com/octorelease/octorelease/tree/master/packages/npm#configuration). In addition the following options are supported.

| Options | Description | Default |
| ------- | ----------- | ------- |
| `pruneShrinkwrap` | List of packages in the workspace that should be published with a pruned npm-shrinkwrap.json. | `[]` |
| `versionIndependent` | List of packages in the workspace that should be versioned independently of the fixed version in lerna.json. | `[]` |

<!-- TODO Mention npm@7 or newer requirement for workspaces -->
