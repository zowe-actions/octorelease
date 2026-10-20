[**@octorelease/core**](../../../../README.md)

***

[@octorelease/core](../../../../globals.md) / [utils](../README.md) / loadPlugins

# Function: loadPlugins()

> **loadPlugins**(`context`): `Promise`\<[`IPluginsLoaded`](../../../../interfaces/IPluginsLoaded.md)\>

Defined in: [utils.ts:121](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/utils.ts#L121)

Load plugins listed in config by requiring their modules from disk.
If running as a GitHub Action, `@octorelease`-scoped plugins missing from
node_modules are loaded from the "dist" folder where they are bundled.

## Parameters

### context

[`IContext`](../../../../interfaces/IContext.md)

Global context object for Octorelease

## Returns

`Promise`\<[`IPluginsLoaded`](../../../../interfaces/IPluginsLoaded.md)\>

Key-value pairs of plugin names and loaded modules
