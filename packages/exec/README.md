# Exec plugin

[Octorelease](https://github.com/zowe-actions/octorelease) plugin to execute shell commands.

[![Build Status](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml)
[![Latest GitHub tag](https://img.shields.io/github/v/tag/zowe-actions/octorelease?sort=date&label=tag)](https://github.com/zowe-actions/octorelease/tags)

| Step | Description |
|------|-------------|
| `init` | Execute a shell command during the init stage. |
| `version` | Execute a shell command during the version stage. |
| `publish` | Execute a shell command during the publish stage. |
| `success` | Execute a shell command during the success stage. |
| `fail` | Execute a shell command during the fail stage. |

## Install

```bash
$ npm install @octorelease/exec -D
```

## Usage

Add this plugin to your [release configuration](https://github.com/zowe-actions/octorelease/blob/master/docs/usage.md#configuration):

```json
{
  "plugins": [
    "@octorelease/exec"
  ]
}
```

## Configuration

### Options

| Option | Description | Default |
| ------- | ----------- | ------- |
| `dryRunAllow` | List of stages for which command should be executed in dry run mode. | `[]` |
| `failCmd`<br>`initCmd`<br>`publishCmd`<br>`successCmd`<br>`versionCmd` | Shell command to execute during the associated stage. | `null` |

### Examples

Run a packaging command during `publish`:

```json
{
  "plugins": [
    ["@octorelease/exec", {
      "publishCmd": "npm run package"
    }]
  ]
}
```
