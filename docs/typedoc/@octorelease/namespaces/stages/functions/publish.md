[**@octorelease/core**](../../../../README.md)

***

[@octorelease/core](../../../../globals.md) / [stages](../README.md) / publish

# Function: publish()

> **publish**(`context`, `pluginsLoaded`): `Promise`\<`void`\>

Defined in: [stages.ts:58](https://github.com/zowe-actions/octorelease/blob/chore/add-dev-docs/packages/core/src/stages.ts#L58)

Run "publish" stage for loaded plugins that have a "publish" handler.
If "publish" is included in `Inputs.skipStages`, this stage will be skipped.

## Parameters

### context

[`IContext`](../../../../interfaces/IContext.md)

Global context object for Octorelease

### pluginsLoaded

[`IPluginsLoaded`](../../../../interfaces/IPluginsLoaded.md)

Key-value pairs of plugin names and loaded modules

## Returns

`Promise`\<`void`\>
