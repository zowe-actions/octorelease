# Octorelease

Automate package versioning and publishing with a configurable release workflow.

[![Test](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml/badge.svg)](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml)

Octorelease runs version updates, changelogs, publishing, and release notifications in CI. Use the GitHub Action or CLI. Inspired by [semantic-release](https://github.com/semantic-release/semantic-release).

## Highlights

- Publish npm packages, Python packages, and VS Code extensions through plugins.
- Release multiple packages from a Lerna workspace.
- Choose versions from package metadata, approved pull request labels, or an explicit version.
- Publish to different release channels, including prereleases and maintenance branches.
- Keep changelogs, version files, Git tags, and GitHub releases together in one workflow.
- Extend the release process with custom plugins and commands.

## How it works

Run Octorelease after your build and tests pass. It checks whether the branch is configured for releases, determines the version, and runs your chosen plugins:

| Step | Purpose |
| --- | --- |
| Initialize | Check credentials and gather information needed for the release. |
| Version | Validate the version, update release files, and commit and tag changes. |
| Publish | Publish packages and upload release assets. |
| Notify | Report the result and run any post-release checks. |

The [configuration](docs/usage.md#configuration) controls which branches can release, which plugins run, and where packages are published.

## Getting started

For GitHub Actions, add Octorelease to your release workflow:

```yaml
- uses: zowe-actions/octorelease@v1
```

Follow the [setup guide](docs/usage.md) to add your release configuration, credentials, and build steps. It includes a complete workflow you can adapt to your project.

For other CI services, install the CLI:

```sh
npm install --save-dev @octorelease/core
npx octorelease
```

To try a prerelease from `master`, install from [Zowe Artifactory](https://zowe.jfrog.io/zowe/api/npm/npm-local-release/):

```sh
npm install --save-dev @octorelease/core@next \
  --@octorelease:registry=https://zowe.jfrog.io/zowe/api/npm/npm-local-release/
```

## Requirements

- A Git repository with release history and tags available in CI.
- A CI service that can run your build and store publishing credentials.
- Access to the package registries and repository you want to publish to.
- Node.js and npm when using the CLI.

## Documentation

- [Usage](docs/usage.md) — Installation, configuration, and running a release.
- [Plugins](docs/extending.md) — Available plugins and reusable configuration.
- [Recipes](docs/recipes.md) — Examples for common CI setups.
- [Release examples](docs/release-examples.md) — How three Zowe projects use Octorelease.
- [Maintainer guide](docs/maintainer-guide.md) — Your first change and how to release it.
- [Developer guide](docs/developer-guide.md) — Design principles, architecture, and plugin development.
- [API reference](docs/typedoc/globals.md) — Exported types and functions.
- [Support](docs/support.md) — Troubleshooting and reporting problems.

## Contributing

Start with the [design principles](docs/developer-guide.md#design-principles), then see [Contributing](CONTRIBUTING.md) for setup, testing, and releases.
