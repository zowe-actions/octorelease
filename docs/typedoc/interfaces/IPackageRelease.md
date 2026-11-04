[**@octorelease/core**](../README.md)

***

[@octorelease/core](../globals.md) / IPackageRelease

# Interface: IPackageRelease

Defined in: [doc/IPackageRelease.ts:20](/packages/core/src/doc/IPackageRelease.ts#L20)

A package selected for an independent release.

## Properties

### directory

> **directory**: `string`

Defined in: [doc/IPackageRelease.ts:23](/packages/core/src/doc/IPackageRelease.ts#L23)

Package directory relative to the repository root.

***

### name

> **name**: `string`

Defined in: [doc/IPackageRelease.ts:21](/packages/core/src/doc/IPackageRelease.ts#L21)

***

### releaseNotes?

> `optional` **releaseNotes?**: `string`

Defined in: [doc/IPackageRelease.ts:27](/packages/core/src/doc/IPackageRelease.ts#L27)

***

### tagName?

> `optional` **tagName?**: `string`

Defined in: [doc/IPackageRelease.ts:26](/packages/core/src/doc/IPackageRelease.ts#L26)

Absent for timestamped snapshots, which do not create Git tags.

***

### version

> **version**: `Omit`\<[`IVersionInfo`](IVersionInfo.md), `"overrides"`\>

Defined in: [doc/IPackageRelease.ts:24](/packages/core/src/doc/IPackageRelease.ts#L24)
