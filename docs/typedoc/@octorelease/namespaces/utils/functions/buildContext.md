[**@octorelease/core**](../../../../README.md)

***

[@octorelease/core](../../../../globals.md) / [utils](../README.md) / buildContext

# Function: buildContext()

> **buildContext**(`opts?`): `Promise`\<[`IContext`](../../../../interfaces/IContext.md) \| `undefined`\>

Defined in: [packages/core/src/utils.ts:45](/packages/core/src/utils.ts#L45)

Build global context object that is passed to all plugin handlers.
Requires a recognized CI environment and a release configuration with a
`branches` array. Plugins are configured here but initialized separately.

## Parameters

### opts?

[`IContextOpts`](../../../../interfaces/IContextOpts.md)

Options for building the context object

## Returns

`Promise`\<[`IContext`](../../../../interfaces/IContext.md) \| `undefined`\>

Shared release context, or undefined when no branch matches and
`opts.force` is not set

## Throws

If CI detection, configuration loading, or Git inspection fails
