# GitHub plugin

[Octorelease](https://github.com/zowe-actions/octorelease) plugin to manage releases, assets, and pull request notifications on GitHub.

[![Build Status](https://github.com/zowe-actions/octorelease/workflows/Test/badge.svg)](https://github.com/zowe-actions/octorelease/actions?query=workflow%3ATest+branch%3Amaster)
[![npm latest version](https://img.shields.io/npm/v/@octorelease/github/latest.svg)](https://www.npmjs.com/package/@octorelease/github)
<!-- [![npm next version](https://img.shields.io/npm/v/@octorelease/github/next.svg)](https://www.npmjs.com/package/@octorelease/github) -->

| Step | Description |
|------|-------------|
| `init` | Prompt for semantic release label on associated pull request. |
| `publish` | Publish a new release to GitHub and upload assets. |
| `success` | Add "released" label to associated pull request. |
| `fail` | Remove semantic release label on associated pull request. |

## Install

```bash
$ npm install @octorelease/github -D
```

## Usage

Add this plugin to your [release configuration](https://github.com/zowe-actions/octorelease/blob/master/docs/usage.md#configuration):

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

| Option | Description | Default |
| ------- | ----------- | ------- |
| `assets` | File patterns to upload to draft GitHub release. Can specify one string or an array of strings. | `[]` |
| `checkPrLabels` | Set `true` to check pull request labels for a semver bump level. Can specify `true` to use default labels, or an array of custom label names (see example below). | `false` |
| `failComment` | Post error details on the associated pull request after a failed release. | `true` |
| `githubUrl` | Hostname of private GitHub instance. | https://github.com |
| `publishRelease` | Set `true` to publish the GitHub release associated with `assets` rather than leaving it in draft mode. | `false` |
| `skipLabelPrompt` | PR labels that skip the prompt and wait for release labelling when `checkPrLabels` is enabled. | `[]` |
| `successComment` | Post a comment on latest pull request after a successful release. | `true` |

### Examples

Upload TGZ archives from the project root to a draft release:

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
Choose version bumps from PR labels:

```json
{
  "plugins": [
    ["@octorelease/github", {
      "checkPrLabels": ["release-current", "release-patch", "release-minor", "release-major"],
      "skipLabelPrompt": ["dependencies"]
    }]
  ]
}
```

The pull request label must be added by a repo admin after the pull request is merged. If you forget to add the label, a reminder comment will be posted on the pull request and you will have 30 minutes to add a label before the build times out. To disable the reminder comment for Dependabot PRs, set `skipLabelPrompt` to `["dependencies"]`.
