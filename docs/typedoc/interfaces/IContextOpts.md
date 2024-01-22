[@octorelease/core](../README.md) / [Exports](../modules.md) / IContextOpts

# Interface: IContextOpts

Options for building the global context object

## Table of contents

### Properties

- [branch](IContextOpts.md#branch)
- [force](IContextOpts.md#force)
- [logPrefix](IContextOpts.md#logprefix)

## Properties

### branch

• `Optional` **branch**: `string`

Overrides the branch name automatically detected in the CI environment.

#### Defined in

[doc/IContextOpts.ts:24](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/doc/IContextOpts.ts#L24)

___

### force

• `Optional` **force**: `boolean`

Forces context to be built even if branch is not a release branch.

#### Defined in

[doc/IContextOpts.ts:29](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/doc/IContextOpts.ts#L29)

___

### logPrefix

• `Optional` **logPrefix**: `string`

Sets custom prefix for log messages.

#### Defined in

[doc/IContextOpts.ts:34](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/doc/IContextOpts.ts#L34)
