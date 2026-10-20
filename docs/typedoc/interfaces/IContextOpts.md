[**@octorelease/core**](../README.md)

***

[@octorelease/core](../globals.md) / IContextOpts

# Interface: IContextOpts

Defined in: [packages/core/src/doc/IContextOpts.ts:20](/packages/core/src/doc/IContextOpts.ts#L20)

Options for building the global context object

## Properties

### branch?

> `optional` **branch?**: `string`

Defined in: [packages/core/src/doc/IContextOpts.ts:24](/packages/core/src/doc/IContextOpts.ts#L24)

Overrides the branch name automatically detected in the CI environment.

***

### force?

> `optional` **force?**: `boolean`

Defined in: [packages/core/src/doc/IContextOpts.ts:29](/packages/core/src/doc/IContextOpts.ts#L29)

Forces context to be built even if branch is not a release branch.

***

### logPrefix?

> `optional` **logPrefix?**: `string`

Defined in: [packages/core/src/doc/IContextOpts.ts:34](/packages/core/src/doc/IContextOpts.ts#L34)

Sets custom prefix for log messages.
