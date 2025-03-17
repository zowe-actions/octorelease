# Changelog plugin

[Octorelease](https://github.com/octorelease/octorelease) plugin to read and update changelogs.

[![Build Status](https://github.com/octorelease/octorelease/workflows/Test/badge.svg)](https://github.com/octorelease/octorelease/actions?query=workflow%3ATest+branch%3Amaster)
[![npm latest version](https://img.shields.io/npm/v/@octorelease/changelog/latest.svg)](https://www.npmjs.com/package/@octorelease/changelog)
<!-- [![npm next version](https://img.shields.io/npm/v/@octorelease/changelog/next.svg)](https://www.npmjs.com/package/@octorelease/changelog) -->

| Step | Description |
|------|-------------|
| `version` | Gather release notes from and update version numbers in the package changelog(s). |

## Install

```bash
$ npm install @octorelease/changelog -D
```

## Usage

The plugin can be configured in the [Octorelease configuration file](https://github.com/octorelease/octorelease/blob/master/docs/usage.md#configuration):

```json
{
  "plugins": [
    "@octorelease/changelog"
  ]
}
```

## Configuration

### Options

| Options | Description | Default |
| ------- | ----------- | ------- |
| `changelogFile` | Path to changelog file to update. | `"CHANGELOG.md"` |
| `displayNames` | For a monorepo, define mapping of package directory names to display names that should be used in release notes (see example below). | `{}` |
| `extraDirs` | Additional directories to scan for changelog files. | `[]` |
| `headerLine` | Header for new release that will be replaced with version number. | `"## Recent Changes"` |

## Examples

To define display names for "packages/api" and "packages/cli" folder in release notes:

```json
{
  "plugins": [
    ["@octorelease/changelog", {
      "displayNames": {
        "cli": "Sample CLI",
        "api": "Sample API"
      }
    }]
  ]
}
```
