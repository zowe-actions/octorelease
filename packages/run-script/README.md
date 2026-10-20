# Run Script action

GitHub action to run scripts in [Octorelease](https://github.com/zowe-actions/octorelease) context.

## Inputs

### `config-dir`

Directory from which to search for release configuration.

### `github-token`

Personal access token for authentication to GitHub APIs. Default `github.token`.

### `script`

**Required** Name of script to run from the [scripts](src/scripts) directory.

### `working-dir`

Custom working directory to use instead of the project root.

## Example usage

```yaml
- uses: zowe-actions/octorelease/script@v1
  with:
    script: npmUpdate
```
