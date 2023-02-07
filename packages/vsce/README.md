# VSCE plugin

[Octorelease](https://github.com/octorelease/octorelease) plugin to perform actions related to VS Code extensions.

[![Build Status](https://github.com/octorelease/octorelease/workflows/Test/badge.svg)](https://github.com/octorelease/octorelease/actions?query=workflow%3ATest+branch%3Amaster)
[![npm latest version](https://img.shields.io/npm/v/@octorelease/vsce/latest.svg)](https://www.npmjs.com/package/@octorelease/vsce)
<!-- [![npm next version](https://img.shields.io/npm/v/@octorelease/vsce/next.svg)](https://www.npmjs.com/package/@octorelease/vsce) -->

| Step | Description |
|------|-------------|
| `init` | Verify personal access tokens to publish to VSIX registry. |
| `publish` | Publish the new extension to VS Code marketplace and/or OVSX registry. |

## Install

```bash
$ npm install @octorelease/vsce -D
```

## Usage

The plugin can be configured in the [Octorelease configuration file](https://github.com/octorelease/octorelease/blob/master/docs/usage.md#configuration):

```json
{
  "plugins": [
    "@octorelease/vsce"
  ]
}
```

## Configuration

### Environment variables

| Variable | Description |
| -------- | ----------- |
| `OVSX_TOKEN` | Personal access token for the OVSX registry. |
| `VSCE_TOKEN` | Personal access token for the VS Code marketplace. |

### Options

| Options | Description | Default |
| ------- | ----------- | ------- |
| `ovsxPublish` | Specify true to publish to the OVSX registry. | `false` |
| `vscePublish` | Specify false to skip publishing to the VS Code marketplace. | `true` |
| `vsixDir` | Path to directory where extension bundle (VSIX) should be generated, or `false` to skip creating a VSIX. | `false` |

### Examples

To publish extension VSIX to both VS Code marketplace and OVSX registry:

```json
{
  "plugins": [
    ["@octorelease/vsce", {
      "ovsxPublish": true,
      "vscePublish": true
    }]
  ]
}
```

---
To skip publishing to any registry and release the extension VSIX with another plugin like [@octorelease/github](https://github.com/octorelease/octorelease/tree/master/packages/github):

```json
{
  "plugins": [
    ["@octorelease/vsce", {
      "vscePublish": false,
      "vsixDir": "dist"
    }],
    ["@octorelease/github", {
      "assets": "dist/*.vsix"
    }]
  ]
}
```
