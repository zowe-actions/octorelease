# Usage

[Overview](../README.md) · [Plugins](extending.md) · [Troubleshooting](support.md)

## For release owners

Use this checklist when preparing a release:

1. Confirm that the changes are merged into the intended release branch and that tests pass.
2. Review the package's `CHANGELOG.md`. Describe changes users will notice, including any upgrade steps.
3. Choose the next version: a patch for compatible fixes, a minor version for compatible features, or a major version for breaking changes.
4. If your project uses the manual workflow below, open **Actions → Release → Run workflow**, choose the release branch, enter the version, and keep dry run enabled for the first run.
5. Review the logs with a maintainer. Run again with dry run disabled to publish, then check the package registry and GitHub release.

If a successful run produces no release, check [Support](support.md#troubleshooting).

## Installation

For GitHub Actions, use `zowe-actions/octorelease@v1`. The action includes the official release plugins; install your project's own build dependencies separately.

For CLI use in another supported CI service:

```sh
npm install --save-dev @octorelease/core
npx octorelease
```

Run from the project root after dependencies, build, and tests have completed. If the package is not installed locally, select it explicitly:

```sh
npx --package=@octorelease/core octorelease
```

- Install additional plugins before running the CLI.
- Include optional dependencies if you use core's changelog, Git, GitHub, or npm plugins.

Prerelease packages from `master` are published to Zowe Artifactory under `next`. Use the [prerelease installation instructions](../packages/core/README.md#install) for core and additional official plugins.

The CLI accepts [environment inputs](#action-inputs), not command-line flags. For example, on a POSIX runner:

```sh
env 'INPUT_DRY-RUN=true' 'INPUT_NEW-VERSION=1.2.3' npx octorelease
```

Run the CLI in CI with Git history, tags, and credentials available. See [runtime requirements and troubleshooting](support.md) if setup fails.

## Configuration

Create one of these files in the project root:

- `.releaserc`, `.releaserc.json`, `.releaserc.yaml`, or `.releaserc.yml`
- `.releaserc.js`, `.releaserc.cjs`, `release.config.js`, or `release.config.cjs`
- A `release` property in `package.json`

- Export JavaScript configuration with `module.exports`.
- Octorelease searches from the working directory upward.
- Set `config-dir` to start the search elsewhere.

```json
{
  "branches": [
    { "name": "main", "level": "minor" },
    { "name": "next", "channel": "next", "prerelease": true }
  ],
  "tagPrefix": "v",
  "plugins": [
    "@octorelease/changelog",
    ["@octorelease/npm", { "smokeTest": true }],
    ["@octorelease/github", { "publishRelease": true }],
    "@octorelease/git"
  ]
}
```

### Release options

- `branches`: Required list of branch names or objects. Glob patterns are supported; the first match wins. Unmatched branches do not release.
- `plugins`: Ordered list of names or `[name, options]` entries. Omit it to load no plugins.
- `tagPrefix`: Git tag prefix; defaults to `v`. Use a distinct prefix for each package released separately from one repository.

### Branch options

- `name`: Branch name or glob pattern.
- `channel`: Distribution channel, such as an npm dist-tag. After the first branch entry, defaults to the matched branch name. npm and Lerna use `latest` when no channel is set.
- `level`: Maximum version bump: `none`, `patch`, `minor`, or `major`. Omit it to allow any bump.
- `prerelease`: Use `true` for the channel name or a string for a custom identifier. Appends a UTC timestamp: `next.YYYYMMDDHHmm`.

For prereleases:

- Set `channel` explicitly when using `prerelease: true` on the first branch entry.
- Omit `prerelease` or set it to `false` for a normal release.
- Use an empty string to mark a prerelease without adding a version suffix.

### Choosing a version

1. Core reads the previous version from the nearest reachable Git tag matching `tagPrefix`, or uses `0.0.0` if none matches.
2. During `init`, npm reads `package.json`; Lerna reads `lerna.json` or the root package version. GitHub can adjust the version from approved PR labels when `checkPrLabels` is enabled.
3. An explicit `new-version` overrides the candidate. Otherwise, core applies the configured prerelease suffix.
4. Core checks the branch's version-bump limit before running `version`.

- Supply a complete version, such as `1.2.3` or `2.0.0-next.1`, for `new-version`.
- Explicit versions still respect branch limits.
- Commit messages do not determine version bumps.

## Plugins

Plugins run in configuration order within each stage.

- Put file-changing plugins before `@octorelease/git`.
- Put artifact builders before uploaders.

A plugin name uses its default options; an array adds options:

```json
{
  "branches": ["main"],
  "plugins": [
    ["@octorelease/npm", { "npmPublish": false, "tarballDir": "dist" }],
    ["@octorelease/github", { "assets": "dist/*.tgz", "publishRelease": true }],
    "@octorelease/git"
  ]
}
```

This configuration packages an npm tarball and uploads it to GitHub without publishing to npm. Supply GitHub and Git credentials as in the workflow below.

Use one entry with multiple option objects to run the same plugin more than once per stage:

```json
["@octorelease/exec", { "publishCmd": "npm run upload-docs" }, { "publishCmd": "npm run notify" }]
```

- Repeating a plugin name in separate entries replaces its earlier options.
- `$cwd` temporarily changes the handler's working directory.
- `$env` temporarily sets environment variables.

See the [plugin catalog](extending.md) for available plugins.

## Workflow configuration

To release an npm project on demand:

- Commit the release configuration and changelog.
- Store an npm publishing token as the `NPM_TOKEN` repository secret.
- Allow the checkout credentials to push to the release branch.

```yaml
name: Release
on:
  workflow_dispatch:
    inputs:
      version:
        description: Full version to publish
        required: true
        type: string
      dry-run:
        description: Preview the release
        type: boolean
        default: true

permissions:
  contents: write
  issues: write
  pull-requests: write

concurrency:
  group: release-${{ github.ref }}
  cancel-in-progress: false

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          ref: ${{ github.ref }}
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
      - uses: zowe-actions/octorelease@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          GIT_COMMITTER_NAME: GitHub Actions
          GIT_COMMITTER_EMAIL: actions@github.com
        with:
          dry-run: ${{ inputs.dry-run }}
          new-version: ${{ inputs.version }}
```

- If tests run in separate jobs, add them to the release job's `needs` list.
- Branch protection and repository token policies still apply.
- See [Recipes](recipes.md) for push-triggered releases and Jenkins.

### Action inputs

| Input | Default | Meaning |
| --- | --- | --- |
| `ci-skip` | `true` | Exit if the latest commit subject contains `[ci skip]`. |
| `config-dir` | Working directory | Directory from which to search for configuration, resolved relative to the initial working directory. |
| `dry-run` | `false` | Preview remote publishing operations. Local preparation still runs; see [dry-run behavior](support.md#what-does-a-dry-run-change). |
| `new-version` | Unset | Complete version string to use after plugin initialization. |
| `skip-stages` | Unset | Comma-separated list: `version,publish,success,fail`. `init` always runs. |
| `working-dir` | Initial working directory | Directory to enter before loading context and plugins, useful for releasing a subpackage. |

- Outside GitHub Actions, uppercase the input name and prefix it with `INPUT_`. Keep hyphens: `INPUT_CONFIG-DIR`.
- The release action has no output variables. Check logs, tags, registry entries, and releases for results.
