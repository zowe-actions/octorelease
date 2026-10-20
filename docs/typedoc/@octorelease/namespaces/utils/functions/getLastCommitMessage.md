[**@octorelease/core**](../../../../README.md)

***

[@octorelease/core](../../../../globals.md) / [utils](../README.md) / getLastCommitMessage

# Function: getLastCommitMessage()

> **getLastCommitMessage**(`context`): `Promise`\<`string` \| `undefined`\>

Defined in: [packages/core/src/utils.ts:216](/packages/core/src/utils.ts#L216)

Retrieve most recent Git commit message if there is one.

## Parameters

### context

[`IContext`](../../../../interfaces/IContext.md)

## Returns

`Promise`\<`string` \| `undefined`\>

Commit message or undefined if there is no Git history
