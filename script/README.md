# octorelease-script

GitHub action to run scripts in [Octorelease](https://github.com/octorelease/octorelease) context.

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
