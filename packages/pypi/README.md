# PyPI plugin

[Octorelease](https://github.com/octorelease/octorelease) plugin to perform actions related to PyPI.

[![Build Status](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/zowe-actions/octorelease/actions/workflows/test.yml)
[![Latest GitHub tag](https://img.shields.io/github/v/tag/zowe-actions/octorelease?sort=date&label=tag)](https://github.com/zowe-actions/octorelease/tags)

| Step | Description |
|------|-------------|
| `init` | Verify that `twine` is installed and configured. |
| `publish` | Publish packages in dist folder to PyPI registry. |

## Install

```bash
$ npm install @octorelease/pypi -D
```

## Usage

The plugin can be configured in the [Octorelease configuration file](https://github.com/octorelease/octorelease/blob/master/docs/usage.md#configuration):

```json
{
  "plugins": [
    "@octorelease/pypi"
  ]
}
```

## Configuration

### Environment variables

| Variable | Description |
| -------- | ----------- |
| `TWINE_USERNAME` | User name of the PyPI publisher. |
| `TWINE_PASSWORD` | Password of the PyPI publisher. |

To log in to PyPI with a token, set `TWINE_USERNAME=__token__` and `TWINE_PASSWORD` to the token value.

### Options

| Options | Description | Default |
| ------- | ----------- | ------- |
| `distPath` | Path to dist folder where packages have been built. | `dist` |
