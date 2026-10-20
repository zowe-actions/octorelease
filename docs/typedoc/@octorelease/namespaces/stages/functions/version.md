[**@octorelease/core**](../../../../README.md)

***

[@octorelease/core](../../../../globals.md) / [stages](../README.md) / version

# Function: version()

> **version**(`context`, `pluginsLoaded`): `Promise`\<`void`\>

Defined in: [stages.ts:78](https://github.com/zowe-actions/octorelease/blob/chore/add-dev-docs/packages/core/src/stages.ts#L78)

Run "version" stage for loaded plugins that have a "version" handler.
If "version" is included in `Inputs.skipStages`, this stage will be skipped.

## Parameters

### context

[`IContext`](../../../../interfaces/IContext.md)

Global context object for Octorelease

### pluginsLoaded

[`IPluginsLoaded`](../../../../interfaces/IPluginsLoaded.md)

Key-value pairs of plugin names and loaded modules

## Returns

`Promise`\<`void`\>
