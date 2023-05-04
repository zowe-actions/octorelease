# Changelog

## `1.0.0`

* Move project .npmrc out of the way for publish
* Manually add tag after npm package is published
* Fix npm pack failing to return tgz filename
* Add `pruneShrinkwrap` option to prune dev and extraneous dependencies from npm-shrinkwrap.json
* Skip npm version in workspaces to avoid conflicts with lerna plugin

## `0.1.0`

* Fixed init stage logging in to npm when `npmPublish` is false
* Licensed project under Apache-2.0

## `0.0.1`

* Initial release to public NPM
