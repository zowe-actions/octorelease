[**@octorelease/core**](../../../../README.md)

***

[@octorelease/core](../../../../globals.md) / [stages](../README.md) / fail

# Function: fail()

> **fail**(`context`, `pluginsLoaded`): `Promise`\<`void`\>

Defined in: [stages.ts:38](https://github.com/zowe-actions/octorelease/blob/master/packages/core/src/stages.ts#L38)

Run "fail" stage for loaded plugins that have a "fail" handler.
If "fail" is included in `Inputs.skipStages`, this stage will be skipped.

## Parameters

### context

[`IContext`](../../../../interfaces/IContext.md)

Global context object for Octorelease

### pluginsLoaded

[`IPluginsLoaded`](../../../../interfaces/IPluginsLoaded.md)

Key-value pairs of plugin names and loaded modules

## Returns

`Promise`\<`void`\>
