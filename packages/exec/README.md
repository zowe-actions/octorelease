# Exec plugin

[Octorelease](https://github.com/octorelease/octorelease) plugin to execute shell commands.

[![Build Status](https://github.com/octorelease/octorelease/workflows/Test/badge.svg)](https://github.com/octorelease/octorelease/actions?query=workflow%3ATest+branch%3Amaster)
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

The plugin can be configured in the [Octorelease configuration file](https://github.com/octorelease/octorelease/blob/master/docs/usage.md#configuration):

```json
{
  "plugins": [
    "@octorelease/exec"
  ]
}
```

## Configuration

### Options

| Options | Description | Default |
| ------- | ----------- | ------- |
| `failCmd`<br>`initCmd`<br>`publishCmd`<br>`successCmd`<br>`versionCmd` | Shell command to execute during the associated stage. | `null` |

### Examples

To run custom command to publish npm package:

```json
{
  "plugins": [
    ["@octorelease/exec", {
      "publishCmd": "npm run package"
    }]
  ]
}
```
