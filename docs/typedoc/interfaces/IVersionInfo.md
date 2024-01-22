[@octorelease/core](../README.md) / [Exports](../modules.md) / IVersionInfo

# Interface: IVersionInfo

Info about project version

## Table of contents

### Properties

- [new](IVersionInfo.md#new)
- [old](IVersionInfo.md#old)
- [overrides](IVersionInfo.md#overrides)
- [prerelease](IVersionInfo.md#prerelease)

## Properties

### new

• **new**: `string`

New version to be released

#### Defined in

[doc/IVersionInfo.ts:29](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/doc/IVersionInfo.ts#L29)

___

### old

• **old**: `string`

Old version found in Git history

#### Defined in

[doc/IVersionInfo.ts:24](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/doc/IVersionInfo.ts#L24)

___

### overrides

• **overrides**: `Record`<`string`, `Omit`<[`IVersionInfo`](IVersionInfo.md), ``"overrides"``\>\>

Version overrides for directories in workspace

#### Defined in

[doc/IVersionInfo.ts:39](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/doc/IVersionInfo.ts#L39)

___

### prerelease

• `Optional` **prerelease**: `string`

Prerelease string if this is a prerelease branch

#### Defined in

[doc/IVersionInfo.ts:34](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/doc/IVersionInfo.ts#L34)
