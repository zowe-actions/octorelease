[**@octorelease/core**](../../../../README.md)

***

[@octorelease/core](../../../../globals.md) / [stages](../README.md) / init

# Function: init()

> **init**(`context`, `pluginsLoaded`): `Promise`\<`void`\>

Defined in: [stages.ts:48](https://github.com/zowe-actions/octorelease/blob/chore/add-dev-docs/packages/core/src/stages.ts#L48)

Run "init" stage for loaded plugins that have an "init" handler.
The "init" stage cannot be skipped.

## Parameters

### context

[`IContext`](../../../../interfaces/IContext.md)

Global context object for Octorelease

### pluginsLoaded

[`IPluginsLoaded`](../../../../interfaces/IPluginsLoaded.md)

Key-value pairs of plugin names and loaded modules

## Returns

`Promise`\<`void`\>
