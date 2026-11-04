# Support

[Usage](usage.md) · [Developer guide](developer-guide.md) · [Report an issue](https://github.com/zowe-actions/octorelease/issues)

## Troubleshooting

Start with the first error and the preceding `Running "…" stage for plugin …` log entry. Later failure-handler errors can obscure the cause.

### Configuration not found or invalid

- For `Failed to load config because file does not exist or is empty`, check that the configuration is committed and nonempty.
- For errors mentioning `branches` or `.map`, supply a `branches` array.
- Check `working-dir` and `config-dir`. `config-dir` takes a directory, not a filename.

See the [configuration example](usage.md#configuration).

### A successful run did not release anything

- `Current branch is not a release branch`: check `branches`. PR builds match the head branch, not the target branch.
- `Commit message contains CI skip phrase`: the latest commit subject contains `[ci skip]`. Set `ci-skip: false` for an intentional rerun.
- No plugin stages in the logs: add plugins to the configuration. There is no default plugin list.
- No GitHub release: enable `publishRelease` or configure `assets`. Assets alone create a draft.

### Environment or plugin loading failed

- `Unsupported CI service detected`: run in a CI environment recognized by `env-ci`. Use handler tests for local development.
- `Cannot find module …`: install the plugin, check its package entry point, or use a local path starting with `./`. Paths resolve from `working-dir`.
- For a local action build, run `npm run pack` to create the plugin bundles.
- `Required environment variable … is undefined`: supply the variable to the release step. Initialization checks run during dry runs too.

### Package or workspace configuration failed

- `Missing or invalid package.json` or `lerna.json`: check the working directory and JSON syntax.
- `No packages found in workspace`: check the `workspaces` globs and package manifests. Run `npx lerna list --all --json` from the release directory.
- `Missing changelog header`: use `## Recent Changes` or set the plugin's `headerLine` option.

See [Lerna requirements](../packages/lerna/README.md#requirements) and the [changelog template](../CONTRIBUTING.md#changelog-entries).

### Wrong version or blocked release

- Wrong previous version or `0.0.0`: fetch full history and tags (`fetch-depth: 0`) and check `tagPrefix`.
- `Protected branch … does not allow … version changes`: check the branch's `level` against the requested bump. `new-version` still goes through validation.
- Waiting for a release label: a repository admin must apply exactly one configured label after the PR is merged. The GitHub plugin waits up to 30 minutes. An explicit `new-version` bypasses label selection.

### Git push rejected

- Check the checkout credentials, token permissions, and branch protection.
- Check whether the remote branch advanced during the run.
- The GitHub plugin's `GITHUB_TOKEN` does not replace Git checkout credentials.

### Source changes are missing from the build

- Rebuild `dist/` with `npm run pack`. `uses: ./` runs the bundle.
- If CI reports an outdated build, run `npm run all`, review the generated changes, and commit them.

## Credentials by plugin

Supply credentials only for the plugins and features you use. Store tokens in CI secrets.

| Plugin | Environment variables |
| --- | --- |
| Git | `GIT_COMMITTER_NAME`, `GIT_COMMITTER_EMAIL`; optionally `GIT_CREDENTIALS` for HTTPS authentication. |
| GitHub | `GITHUB_TOKEN`, with permission to perform the configured operations. |
| npm / Lerna | `NPM_TOKEN`, or the legacy `NPM_USERNAME`, `NPM_PASSWORD`, and `NPM_EMAIL` combination where supported. |
| PyPI | `TWINE_USERNAME`, `TWINE_PASSWORD`; also requires Twine on `PATH`. |
| VS Code Marketplace | `VSCE_PAT` when Marketplace publishing is enabled. |
| Open VSX | `OVSX_PAT` when `ovsxPublish` is enabled. |

## What does a dry run change?

Dry runs skip or simulate remote writes. Local preparation still runs:

- **npm / Lerna:** update versions and lockfiles, create tarballs, and run package lifecycle scripts. npm authentication writes to the user's `.npmrc` and checks credentials.
- **Git:** configure identity and create local commits and tags. Pushes use `--dry-run`.
- **Changelog:** update local release headings.
- **GitHub:** read repository data; skip release, label, and comment writes guarded by dry-run checks.
- **Exec:** skip commands unless their stage is listed in `dryRunAllow`.
- **Custom plugins:** follow each plugin's documented dry-run behavior.

Use a disposable CI checkout and environment. `skip-stages: publish` still allows changes during `init` and `version`.

## Recovering a partial release

Octorelease does not roll back completed operations when a later stage fails.

1. Check the Git tag, registry version, GitHub release, and assets to identify what completed.
2. Fix the failed operation.
3. Rerun with the same intended version to finish that release.

Before retrying:

- Skip `version` only if preparation is complete. This also skips changelog collection, which later handlers may need.
- `init` always runs.
- npm detects published versions; GitHub reuses existing releases and skips duplicate asset names.
- Check custom plugins for other operations that could repeat.

## Frequently asked questions

### How is this related to semantic-release?

Octorelease is inspired by [semantic-release](https://github.com/semantic-release/semantic-release), with its own stages and plugin API:

- Versions come from package files, approved PR labels, or an explicit input.
- Release notes come from existing changelogs.
- Plugins and configuration are specific to Octorelease.

### Which Node.js version should I use?

- **CLI and development:** use a version covered by the [test workflow](../.github/workflows/test.yml).
- **GitHub Action:** the runtime is declared in [action.yml](../action.yml).

## Reporting a problem

[Open an issue](https://github.com/zowe-actions/octorelease/issues) with:

- Octorelease tag or package version.
- Node.js and npm versions, and CI provider.
- Failing stage and plugin.
- Minimal configuration and the first relevant error.
- Workflow run link, if available.

Remove credentials before sharing logs or configuration.
