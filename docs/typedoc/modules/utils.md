[@octorelease/core](../README.md) / [Exports](../modules.md) / utils

# Namespace: utils

## Table of contents

### Functions

- [buildContext](utils.md#buildcontext)
- [dryRunTask](utils.md#dryruntask)
- [getLastCommitMessage](utils.md#getlastcommitmessage)
- [loadPlugins](utils.md#loadplugins)
- [verifyConditions](utils.md#verifyconditions)

## Functions

### buildContext

▸ **buildContext**(`opts?`): `Promise`<[`IContext`](../interfaces/IContext.md) \| `undefined`\>

Build global context object that is passed to all plugin handlers.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `Object` |
| `opts.branch?` | `string` |
| `opts.force?` | `boolean` |

#### Returns

`Promise`<[`IContext`](../interfaces/IContext.md) \| `undefined`\>

Global context object for Octorelease

#### Defined in

[utils.ts:29](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/utils.ts#L29)

___

### dryRunTask

▸ **dryRunTask**<`T`\>(`context`, `description`, `task`): `Promise`<`T` \| `undefined`\>

In dry run mode skip the task, otherwise run it.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](../interfaces/IContext.md) | Global context object for Octorelease |
| `description` | `string` | Description to log when task is skipped |
| `task` | () => `Promise`<`T`\> | Callback to execute when not in dry run mode |

#### Returns

`Promise`<`T` \| `undefined`\>

#### Defined in

[utils.ts:84](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/utils.ts#L84)

___

### getLastCommitMessage

▸ **getLastCommitMessage**(`context`): `Promise`<`string` \| `undefined`\>

Retrieve most recent Git commit message if there is one.

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`IContext`](../interfaces/IContext.md) |

#### Returns

`Promise`<`string` \| `undefined`\>

Commit message or undefined if there is no Git history

#### Defined in

[utils.ts:160](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/utils.ts#L160)

___

### loadPlugins

▸ **loadPlugins**(`context`): `Promise`<[`IPluginsLoaded`](../interfaces/IPluginsLoaded.md)\>

Load plugins listed in config by requiring their modules from disk.
If running as a GitHub Action, @octorelease-scoped plugins missing from
node_modules are loaded from the "dist" folder where they are bundled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](../interfaces/IContext.md) | Global context object for Octorelease |

#### Returns

`Promise`<[`IPluginsLoaded`](../interfaces/IPluginsLoaded.md)\>

Key-value pairs of plugin names and loaded modules

#### Defined in

[utils.ts:100](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/utils.ts#L100)

___

### verifyConditions

▸ **verifyConditions**(`context`): `Promise`<`void`\>

Verify release conditions after plugins have initialized before proceeding.
This finalizes the new version by appending a prerelease string if one is
defined and failing the build if the version bump is prohibited by protected
branch rules.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](../interfaces/IContext.md) | Global context object for Octorelease |

#### Returns

`Promise`<`void`\>

#### Defined in

[utils.ts:122](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/utils.ts#L122)
