# Exec plugin

[Octorelease](https://github.com/zowe-actions/octorelease) plugin to execute shell commands.

[![Build Status](https://github.com/zowe-actions/octorelease/workflows/Test/badge.svg)](https://github.com/zowe-actions/octorelease/actions?query=workflow%3ATest+branch%3Amaster)
[![npm latest version](https://img.shields.io/npm/v/@octorelease/exec/latest.svg)](https://www.npmjs.com/package/@octorelease/exec)
<!-- [![npm next version](https://img.shields.io/npm/v/@octorelease/exec/next.svg)](https://www.npmjs.com/package/@octorelease/exec) -->

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
