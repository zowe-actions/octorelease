[**@octorelease/core**](../../../../README.md)

***

[@octorelease/core](../../../../globals.md) / [utils](../README.md) / dryRunTask

# Function: dryRunTask()

> **dryRunTask**\<`T`\>(`context`, `description`, `task`): `Promise`\<`T` \| `undefined`\>

Defined in: [packages/core/src/utils.ts:109](/packages/core/src/utils.ts#L109)

In dry run mode skip the task, otherwise run it.
Only the supplied callback is guarded; callers must separately handle any
preparation, file writes, or external commands performed outside it.

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

Task result, or undefined when skipped
