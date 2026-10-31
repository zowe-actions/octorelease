# Changelog

## Recent Changes

* Reuse workspace discovery and the independent release plan to avoid repeated Lerna package listings.
* Added configurable package tags and change detection against each package's previous stable release, with Git and GitHub release integration.
* Added `versionIndependent: true` to publish changed packages using their manifest versions, with per-package prerelease versions on prerelease branches.

## `1.5.4`

* Fixed `pnpm dlx` overriding local package versions when running dev deps

## `1.0.2`

* Fixed `lerna version` being run when version is already deployed

## `1.0.0`

* First stable release

## `0.1.1`

* Fixed init stage not detecting publish registry configured in lerna.json

## `0.1.0`

* Fixed init stage logging in to npm when `npmPublish` is false
* Licensed project under Apache-2.0

## `0.0.1`

* Initial release to public NPM
