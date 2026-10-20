[**@octorelease/core**](../../../../README.md)

***

[@octorelease/core](../../../../globals.md) / [stages](../README.md) / success

# Function: success()

> **success**(`context`, `pluginsLoaded`): `Promise`\<`void`\>

Defined in: [stages.ts:68](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/stages.ts#L68)

Run "success" stage for loaded plugins that have a "success" handler.
If "success" is included in `Inputs.skipStages`, this stage will be skipped.

## Parameters

### context

[`IContext`](../../../../interfaces/IContext.md)

Global context object for Octorelease

### pluginsLoaded

[`IPluginsLoaded`](../../../../interfaces/IPluginsLoaded.md)

Key-value pairs of plugin names and loaded modules

## Returns

`Promise`\<`void`\>
