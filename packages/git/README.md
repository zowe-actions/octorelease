# Git plugin

[Octorelease](https://github.com/octorelease/octorelease) plugin to perform actions on a Git repository.

[![Build Status](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml)
[![Latest GitHub tag](https://img.shields.io/github/v/tag/zowe-actions/octorelease?sort=date&label=tag)](https://github.com/zowe-actions/octorelease/tags)

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
| `GIT_CREDENTIALS` | Authentication to Git repository (in format `user:password`). |

### Options

| Options | Description | Default |
| ------- | ----------- | ------- |
| `commitMessage` | Message for version commit. `{{version}}` is a placeholder for the version number. | `"Bump version to {{version}}"` |
| `tagMessage` | Message for annotated version tag. `{{version}}` is a placeholder for the version number. | `"Release {{version}} to ${context.branch.channel}"` |
