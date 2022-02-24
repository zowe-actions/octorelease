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

[doc/IProtectedBranch.ts:13](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IProtectedBranch.ts#L13)

___

### level

• `Optional` **level**: ``"major"`` \| ``"minor"`` \| ``"patch"``

Maximum semver bump level allowed

#### Defined in

[doc/IProtectedBranch.ts:18](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IProtectedBranch.ts#L18)

___

### name

• **name**: `string`

Branch name

#### Defined in

[doc/IProtectedBranch.ts:8](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IProtectedBranch.ts#L8)

___

### prerelease

• `Optional` **prerelease**: `string` \| `boolean`

Prerelease name (defaults to branch name if `true`)

#### Defined in

[doc/IProtectedBranch.ts:23](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IProtectedBranch.ts#L23)
