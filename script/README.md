# Sample plugin

GitHub action to run scripts in [Octorelease](https://github.com/octorelease/octorelease) context.

<!-- [![Build Status](https://github.com/octorelease/run-script/workflows/Test/badge.svg)](https://github.com/octorelease/run-script/actions?query=workflow%3ATest+branch%3Amaster)
[![npm latest version](https://img.shields.io/npm/v/@octorelease/run-script/latest.svg)](https://www.npmjs.com/package/@octorelease/run-script)
[![npm next version](https://img.shields.io/npm/v/@octorelease/run-script/next.svg)](https://www.npmjs.com/package/@octorelease/run-script) -->

## Inputs

### `artifact-name`

Name of artifact to create for sharing data between jobs.

### `github-token`

Personal access token for authentication to GitHub APIs. Default `github.token`.

### `script`

**Required** Name of script to run from the [scripts](scripts) directory.

### `working-dir`

Custom working directory to use instead of the project root.

## Example usage

```yaml
- uses: zowe-actions/octorelease/script@v1
  with:
    script: npmUpdate
```
