# Changelog plugin

[Octorelease](https://github.com/zowe-actions/octorelease) plugin to read and update changelogs.

[![Build Status](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml)
[![Latest GitHub tag](https://img.shields.io/github/v/tag/zowe-actions/octorelease?sort=date&label=tag)](https://github.com/zowe-actions/octorelease/tags)

| Step | Description |
|------|-------------|
| `version` | Gather release notes from and update version numbers in the package changelog(s). |

## Install

```bash
$ npm install @octorelease/changelog -D
```

## Usage

Add this plugin to your [release configuration](https://github.com/zowe-actions/octorelease/blob/master/docs/usage.md#configuration):

```json
{
  "plugins": [
    "@octorelease/changelog"
  ]
}
```

## Configuration

### Options

| Option | Description | Default |
| ------- | ----------- | ------- |
| `autoDisplayNames` | For a monorepo, automatically load display names from the top level header in `README.md` for each package. | `true` |
| `changelogFile` | Path to changelog file to update. | `"CHANGELOG.md"` |
| `displayNames` | For a monorepo, map package directory names to custom display names that are used in release notes. Use `false` to exclude a package from release notes (see examples below). | `{}` |
| `extraDirs` | Additional directories to scan for changelog files. | `[]` |
| `headerLine` | Header for new release that will be replaced with version number. | `"## Recent Changes"` |

## Examples

Set release-note headings for `packages/api` and `packages/cli`:

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

Read display names from package READMEs and omit the API package:

```json
{
  "plugins": [
    ["@octorelease/changelog", {
      "autoDisplayNames": true,
      "displayNames": {
        "api": false
      }
    }]
  ]
}
```
