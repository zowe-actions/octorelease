[@octorelease/core](../README.md) / [Exports](../modules.md) / IProtectedBranch

# Interface: IProtectedBranch

Protected branch configuration object

## Table of contents

### Properties

- [channel](IProtectedBranch.md#channel)
- [level](IProtectedBranch.md#level)
- [name](IProtectedBranch.md#name)
- [prerelease](IProtectedBranch.md#prerelease)

## Properties

### channel

• `Optional` **channel**: `string`

Release channel (e.g., NPM tag)

#### Defined in

[doc/IProtectedBranch.ts:34](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/doc/IProtectedBranch.ts#L34)

___

### level

• `Optional` **level**: ``"none"`` \| ``"patch"`` \| ``"minor"`` \| ``"major"``

Maximum semver bump level allowed

#### Defined in

[doc/IProtectedBranch.ts:39](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/doc/IProtectedBranch.ts#L39)

___

### name

• **name**: `string`

Branch name

#### Defined in

[doc/IProtectedBranch.ts:29](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/doc/IProtectedBranch.ts#L29)

___

### prerelease

• `Optional` **prerelease**: `string` \| `boolean`

Prerelease name (defaults to branch name if `true`)

#### Defined in

[doc/IProtectedBranch.ts:44](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/doc/IProtectedBranch.ts#L44)
