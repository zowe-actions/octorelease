# Git plugin

[Octorelease](https://github.com/zowe-actions/octorelease) plugin to configure Git, commit release changes, and create tags.

[![Build Status](https://github.com/zowe-actions/octorelease/workflows/Test/badge.svg)](https://github.com/zowe-actions/octorelease/actions?query=workflow%3ATest+branch%3Amaster)
[![npm latest version](https://img.shields.io/npm/v/@octorelease/git/latest.svg)](https://www.npmjs.com/package/@octorelease/git)
<!-- [![npm next version](https://img.shields.io/npm/v/@octorelease/git/next.svg)](https://www.npmjs.com/package/@octorelease/git) -->

| Step | Description |
|------|-------------|
| `init` | Configure user name and email to be used for Git commits. |
| `version` | Commit changed files, tag the new version, and push these changes. |

## Install

```bash
$ npm install @octorelease/git -D
```

## Usage

Add this plugin to your [release configuration](https://github.com/zowe-actions/octorelease/blob/master/docs/usage.md#configuration):

```json
{
  "plugins": [
    "@octorelease/git"
  ]
}
```

## Configuration

### Environment variables

| Variable | Description |
| -------- | ----------- |
| `GIT_COMMITTER_NAME` | User name of the Git committer. |
| `GIT_COMMITTER_EMAIL` | Email address of the Git committer. |
| `GIT_CREDENTIALS` | Authentication to Git repository (in format `user:password`). |

### Options

| Option | Description | Default |
| ------- | ----------- | ------- |
| `commitMessage` | Message for version commit. `{{version}}` is a placeholder for the version number. | `"Bump version to {{version}}"` |
| `tagMessage` | Message for annotated version tag. `{{version}}` is a placeholder for the version number. | `"Release {{version}} to ${context.branch.channel}"` |
