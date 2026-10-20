[**@octorelease/core**](../README.md)

***

[@octorelease/core](../globals.md) / IVersionInfo

# Interface: IVersionInfo

Defined in: [doc/IVersionInfo.ts:20](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IVersionInfo.ts#L20)

Info about project version

## Properties

### new

> **new**: `string`

Defined in: [doc/IVersionInfo.ts:29](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IVersionInfo.ts#L29)

New version to be released

***

### old

> **old**: `string`

Defined in: [doc/IVersionInfo.ts:24](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IVersionInfo.ts#L24)

Old version found in Git history

***

### overrides

> **overrides**: `Record`\<`string`, `Omit`\<`IVersionInfo`, `"overrides"`\>\>

Defined in: [doc/IVersionInfo.ts:39](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IVersionInfo.ts#L39)

Version overrides for directories in workspace

***

### prerelease?

> `optional` **prerelease?**: `string`

Defined in: [doc/IVersionInfo.ts:34](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IVersionInfo.ts#L34)

Prerelease string if this is a prerelease branch
