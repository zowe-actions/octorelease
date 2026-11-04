# Run Script action

GitHub action to run scripts in [Octorelease](https://github.com/zowe-actions/octorelease) context.

[![Build Status](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml)
[![Latest GitHub tag](https://img.shields.io/github/v/tag/zowe-actions/octorelease?sort=date&label=tag)](https://github.com/zowe-actions/octorelease/tags)

## Inputs

### `config-dir`

Custom directory to search for release configuration.

### `github-token`

Personal access token for authentication to GitHub APIs. Default `github.token`.

### `script`

**Required** Name of a built-in script to run from the [scripts](src/scripts) directory, or a
`./`-prefixed path to a custom script (resolved relative to the working directory) to run with a
hydrated Octorelease context. See [customScript.ts](__tests__/fixtures/customScript.ts) for a
sample custom script.

### `working-dir`

Custom working directory to use instead of the project root.

## Outputs

### `result`

The output of the script for other steps to reference.

## Permissions

For events such as `push` and `workflow_run`, the action uses the GitHub API to find
pull requests associated with the triggering commit. This existing lookup requires
`pull-requests: read` for the `github-token`.

For example, a workflow that checks out the repository and runs a script can use:

```yaml
permissions:
  contents: read
  pull-requests: read
```

Scripts and plugins may require additional permissions for their operations, such as
`contents: write` to push repository changes.

## Example usage

```yaml
- uses: zowe-actions/octorelease/script@v1
  with:
    script: npmUpdate
```

```yaml
- uses: zowe-actions/octorelease/script@v1
  with:
    script: ./ci/mycustomscript.js
```
