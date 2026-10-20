[**@octorelease/core**](../../../../README.md)

***

[@octorelease/core](../../../../globals.md) / [utils](../README.md) / getLastCommitMessage

# Function: getLastCommitMessage()

> **getLastCommitMessage**(`context`): `Promise`\<`string` \| `undefined`\>

Defined in: [utils.ts:216](https://github.com/zowe-actions/octorelease/blob/chore/add-dev-docs/packages/core/src/utils.ts#L216)

Retrieve most recent Git commit message if there is one.

## Parameters

### context

[`IContext`](../../../../interfaces/IContext.md)

## Returns

`Promise`\<`string` \| `undefined`\>

Commit message or undefined if there is no Git history
