[**@octorelease/core**](../../../../README.md)

***

[@octorelease/core](../../../../globals.md) / [utils](../README.md) / dryRunTask

# Function: dryRunTask()

> **dryRunTask**\<`T`\>(`context`, `description`, `task`): `Promise`\<`T` \| `undefined`\>

Defined in: [utils.ts:102](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/utils.ts#L102)

In dry run mode skip the task, otherwise run it.

## Type Parameters

### T

`T`

## Parameters

### context

[`IContext`](../../../../interfaces/IContext.md)

Global context object for Octorelease

### description

`string`

Description to log when task is skipped

### task

() => `Promise`\<`T`\>

Callback to execute when not in dry run mode

## Returns

`Promise`\<`T` \| `undefined`\>
