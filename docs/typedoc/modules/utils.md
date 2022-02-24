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

▸ **buildContext**(): `Promise`<[`IContext`](../interfaces/IContext.md) \| `undefined`\>

Build global context object that is passed to all plugin handlers.

#### Returns

`Promise`<[`IContext`](../interfaces/IContext.md) \| `undefined`\>

Global context object for Octorelease

#### Defined in

[utils.ts:12](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/utils.ts#L12)

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

[utils.ts:60](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/utils.ts#L60)

___

### getLastCommitMessage

▸ **getLastCommitMessage**(): `Promise`<`string` \| `undefined`\>

Retrieve most recent Git commit message if there is one.

#### Returns

`Promise`<`string` \| `undefined`\>

Commit message or undefined if there is no Git history

#### Defined in

[utils.ts:72](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/utils.ts#L72)

___

### loadPlugins

▸ **loadPlugins**(`context`): `Promise`<[`IPluginsLoaded`](../interfaces/IPluginsLoaded.md)\>

Load plugins listed in config by requiring their modules from disk.
If running as a GitHub Action, @octorelease-scoped plugins are loaded from
the "dist" folder where they are bundled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](../interfaces/IContext.md) | Global context object for Octorelease |

#### Returns

`Promise`<[`IPluginsLoaded`](../interfaces/IPluginsLoaded.md)\>

Key-value pairs of plugin names and loaded modules

#### Defined in

[utils.ts:84](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/utils.ts#L84)

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

[utils.ts:105](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/utils.ts#L105)
