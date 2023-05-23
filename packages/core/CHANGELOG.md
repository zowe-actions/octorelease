# Changelog

## `1.0.1`

* Fixed wrong branch detected for GitHub Actions `pull_request` builds
* Fixed Git tags being matched that do not conform to semver

## `1.0.0`

* Include unannotated tags in check for old version
* Automatically detect log prefix from call stack
* Create `IContextOpts` interface for options passed to `buildContext` method

## `0.2.0`

* Added support for more than one config object per plugin in release config
* Added support for `$cwd` and `$env` in plugin config to override environment
* Updated dependencies for technical currency

## `0.1.5`

* Fixed CI skip may be detected in wrong commit message

## `0.1.2`

* Fixed prerelease tags on versions not being handled correctly
* Fixed branch name not being set correctly when wildcard is used in config
* Added option to override branch name on `buildContext` method

## `0.1.1`

* Fixed scoped plugins failing to load from node_modules
* Filtered Git tags in monorepo based on prefix
* Removed check for CI skip phrase in last commit message
* Licensed project under Apache-2.0

## `0.1.0`

* Added typedoc to exported APIs

## `0.0.2`

* Fixed source code missing from NPM package

## `0.0.1`

* Initial release to public NPM
