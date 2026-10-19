# Run Script action

GitHub action to run scripts in [Octorelease](https://github.com/octorelease/octorelease) context.

[![Build Status](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml)
[![Latest GitHub tag](https://img.shields.io/github/v/tag/zowe-actions/octorelease?sort=date&label=tag)](https://github.com/zowe-actions/octorelease/tags)

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
- uses: zowe-actions/octorelease/run-script@v1
  with:
    script: npmUpdate
```
