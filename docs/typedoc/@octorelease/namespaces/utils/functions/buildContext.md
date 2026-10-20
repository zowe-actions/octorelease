[**@octorelease/core**](../../../../README.md)

***

[@octorelease/core](../../../../globals.md) / [utils](../README.md) / buildContext

# Function: buildContext()

> **buildContext**(`opts?`): `Promise`\<[`IContext`](../../../../interfaces/IContext.md) \| `undefined`\>

Defined in: [utils.ts:41](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/utils.ts#L41)

Build global context object that is passed to all plugin handlers.

## Parameters

### opts?

[`IContextOpts`](../../../../interfaces/IContextOpts.md)

Options for building the context object

## Returns

`Promise`\<[`IContext`](../../../../interfaces/IContext.md) \| `undefined`\>

Global context object for Octorelease
