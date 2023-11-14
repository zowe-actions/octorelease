# PyPI plugin

[Octorelease](https://github.com/octorelease/octorelease) plugin to perform actions related to PyPI.

[![Build Status](https://github.com/octorelease/octorelease/workflows/Test/badge.svg)](https://github.com/octorelease/octorelease/actions?query=workflow%3ATest+branch%3Amaster)
[![npm latest version](https://img.shields.io/npm/v/@octorelease/pypi/latest.svg)](https://www.npmjs.com/package/@octorelease/pypi)
<!-- [![npm next version](https://img.shields.io/npm/v/@octorelease/pypi/next.svg)](https://www.npmjs.com/package/@octorelease/pypi) -->

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

To log in to PyPI with a token, set `TWINE_USERNAME=_token_` and `TWINE_PASSWORD` to the token value.

### Options

| Options | Description | Default |
| ------- | ----------- | ------- |
| `distPath` | Path to dist folder where packages have been built. | `dist` |
