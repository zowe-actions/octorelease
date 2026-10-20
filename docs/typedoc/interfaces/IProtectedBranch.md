[**@octorelease/core**](../README.md)

***

[@octorelease/core](../globals.md) / IProtectedBranch

# Interface: IProtectedBranch

Defined in: [packages/core/src/doc/IProtectedBranch.ts:25](/packages/core/src/doc/IProtectedBranch.ts#L25)

Protected branch configuration object

## Properties

### channel?

> `optional` **channel?**: `string`

Defined in: [packages/core/src/doc/IProtectedBranch.ts:34](/packages/core/src/doc/IProtectedBranch.ts#L34)

Release channel (e.g., NPM tag)

***

### level?

> `optional` **level?**: `"none"` \| `"patch"` \| `"minor"` \| `"major"`

Defined in: [packages/core/src/doc/IProtectedBranch.ts:39](/packages/core/src/doc/IProtectedBranch.ts#L39)

Maximum semver bump level allowed

***

### name

> **name**: `string`

Defined in: [packages/core/src/doc/IProtectedBranch.ts:29](/packages/core/src/doc/IProtectedBranch.ts#L29)

Branch name

***

### prerelease?

> `optional` **prerelease?**: `string` \| `boolean`

Defined in: [packages/core/src/doc/IProtectedBranch.ts:44](/packages/core/src/doc/IProtectedBranch.ts#L44)

Prerelease name (defaults to branch name if `true`)
