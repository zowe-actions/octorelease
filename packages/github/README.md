# GitHub plugin

[Octorelease](https://github.com/octorelease/octorelease) plugin to perform actions related to GitHub.

[![Build Status](https://github.com/octorelease/octorelease/workflows/Test/badge.svg)](https://github.com/octorelease/octorelease/actions?query=workflow%3ATest+branch%3Amaster)
[![npm latest version](https://img.shields.io/npm/v/@octorelease/github/latest.svg)](https://www.npmjs.com/package/@octorelease/github)
<!-- [![npm next version](https://img.shields.io/npm/v/@octorelease/github/next.svg)](https://www.npmjs.com/package/@octorelease/github) -->

| Step | Description |
|------|-------------|
| `init` | Prompt for semantic release label on associated pull request. |
| `version` | Publish a new release to GitHub and upload assets. |
| `success` | Add "released" label to associated pull request. |
| `fail` | Remove semantic release label on associated pull request. |

## Install

```bash
$ npm install @octorelease/github -D
```

## Usage

The plugin can be configured in the [Octorelease configuration file](https://github.com/octorelease/octorelease/blob/master/docs/usage.md#configuration):

```json
{
  "plugins": [
    "@octorelease/github"
  ]
}
```

## Configuration

### Environment variables

| Variable | Description |
| -------- | ----------- |
| `GITHUB_TOKEN` | Access token to perform GitHub operations. |

### Options

| Options | Description | Default |
| ------- | ----------- | ------- |
| `assets` | File patterns to upload to GitHub release. Can specify one string or an array of strings. | `[]` |
| `checkPrLabels` | Specify true to check pull request labels for a semver bump level. Can specify `true` to use default labels, or an array of custom label names (see example below). | `false` |
| `githubUrl` | Hostname of private GitHub instance. | https://github.com |

### Examples

To publish any TGZ archive created in the project root directory:

```json
{
  "plugins": [
    ["@octorelease/github", {
      "assets": "*.tgz"
    }]
  ]
}
```

---
To check pull request labels for a semver bump level:

```json
{
  "plugins": [
    ["@octorelease/github", {
      "checkPrLabels": ["release-none", "release-patch", "release-minor", "release-major"]
    }]
  ]
}
```

The pull request label must be added by a repo admin after the pull request is merged. If you forget to add the label, a reminder comment will be posted on the pull request and you will have 30 minutes to add a label before the build times out.
