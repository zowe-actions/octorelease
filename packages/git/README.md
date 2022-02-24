# Git plugin

[Octorelease](https://github.com/octorelease/octorelease) plugin to perform actions on a Git repository.

[![Build Status](https://github.com/octorelease/octorelease/workflows/Test/badge.svg)](https://github.com/octorelease/octorelease/actions?query=workflow%3ATest+branch%3Amaster)
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

The plugin can be configured in the [Octorelease configuration file](https://github.com/octorelease/octorelease/blob/master/docs/usage.md#configuration):

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

### Options

| Options | Description | Default |
| ------- | ----------- | ------- |
| `commitMessage` | Message for version commit. `{{version}}` is a placeholder for the version number. | `"Bump version to {{version}}"` |
| `tagMessage` | Message for annotated version tag. `{{version}}` is a placeholder for the version number. | `"Release {{version}} to ${context.branch.channel}"` |
