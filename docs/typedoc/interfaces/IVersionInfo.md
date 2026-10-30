[**@octorelease/core**](../README.md)

***

[@octorelease/core](../globals.md) / IVersionInfo

# Interface: IVersionInfo

Defined in: [packages/core/src/doc/IVersionInfo.ts:20](/packages/core/src/doc/IVersionInfo.ts#L20)

Info about project version

## Properties

### new

> **new**: `string`

Defined in: [packages/core/src/doc/IVersionInfo.ts:29](/packages/core/src/doc/IVersionInfo.ts#L29)

New version to be released

***

### old

> **old**: `string`

Defined in: [packages/core/src/doc/IVersionInfo.ts:24](/packages/core/src/doc/IVersionInfo.ts#L24)

Old version found in Git history

***

### overrides

> **overrides**: `Record`\<`string`, `Omit`\<`IVersionInfo`, `"overrides"`\>\>

Defined in: [packages/core/src/doc/IVersionInfo.ts:39](/packages/core/src/doc/IVersionInfo.ts#L39)

Version overrides for directories in workspace

***

### prerelease?

> `optional` **prerelease?**: `string`

Defined in: [packages/core/src/doc/IVersionInfo.ts:34](/packages/core/src/doc/IVersionInfo.ts#L34)

Prerelease string if this is a prerelease branch
