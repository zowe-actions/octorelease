# Octorelease

Extensible GitHub action to publish semantic releases. Inspired by [semantic-release](https://github.com/semantic-release/semantic-release).

[![Build Status](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml)
[![Latest GitHub tag](https://img.shields.io/github/v/tag/zowe-actions/octorelease?sort=date&label=tag)](https://github.com/zowe-actions/octorelease/tags)

## Documentation

- [Usage](docs/usage.md) - Octorelease installation and configuration
- [Extending](docs/extending.md) - Extending Octorelease with plugins and shareable configurations
- [Recipes](docs/recipes.md) - Community written recipes for common Octorelease use-cases
- [Developer Guide](docs/developer-guide.md) - The essentials of writing an Octorelease plugin or sharable configurations
- [Support](docs/support.md) - FAQ and troubleshooting

## Quick start

Use the action in your CI workflow:

```yaml
- uses: zowe-actions/octorelease@v1
```

Or install prerelease packages from
[Zowe Artifactory](https://zowe.jfrog.io/zowe/api/npm/npm-local-release/) using the
`next` tag:

```sh
npm install --save-dev @octorelease/core@next \
  --@octorelease:registry=https://zowe.jfrog.io/zowe/api/npm/npm-local-release/
```
