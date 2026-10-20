[**@octorelease/core**](../../../../README.md)

***

[@octorelease/core](../../../../globals.md) / [utils](../README.md) / verifyConditions

# Function: verifyConditions()

> **verifyConditions**(`context`): `Promise`\<`void`\>

Defined in: [utils.ts:152](https://github.com/zowe-actions/octorelease/blob/master/packages/core/src/utils.ts#L152)

Verify release conditions after plugins have initialized before proceeding.
This finalizes the new version by appending a prerelease string if one is
defined and failing the build if the version bump is prohibited by protected
branch rules.

## Parameters

### context

[`IContext`](../../../../interfaces/IContext.md)

Global context object for Octorelease

## Returns

`Promise`\<`void`\>
