[@octorelease/core](../README.md) / [Exports](../modules.md) / stages

# Namespace: stages

## Table of contents

### Functions

- [fail](stages.md#fail)
- [init](stages.md#init)
- [publish](stages.md#publish)
- [success](stages.md#success)
- [version](stages.md#version)

## Functions

### fail

▸ **fail**(`context`, `pluginsLoaded`): `Promise`<`void`\>

Run "fail" stage for loaded plugins that have a "fail" handler.
If "fail" is included in `Inputs.skipStages`, this stage will be skipped.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](../interfaces/IContext.md) | Global context object for Octorelease |
| `pluginsLoaded` | [`IPluginsLoaded`](../interfaces/IPluginsLoaded.md) | Key-value pairs of plugin names and loaded modules |

#### Returns

`Promise`<`void`\>

#### Defined in

[stages.ts:12](https://github.com/t1m0thyj/octorelease/blob/efbfdf0/packages/core/src/stages.ts#L12)

___

### init

▸ **init**(`context`, `pluginsLoaded`): `Promise`<`void`\>

Run "init" stage for loaded plugins that have an "init" handler.
The "init" stage cannot be skipped.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](../interfaces/IContext.md) | Global context object for Octorelease |
| `pluginsLoaded` | [`IPluginsLoaded`](../interfaces/IPluginsLoaded.md) | Key-value pairs of plugin names and loaded modules |

#### Returns

`Promise`<`void`\>

#### Defined in

[stages.ts:31](https://github.com/t1m0thyj/octorelease/blob/efbfdf0/packages/core/src/stages.ts#L31)

___

### publish

▸ **publish**(`context`, `pluginsLoaded`): `Promise`<`void`\>

Run "publish" stage for loaded plugins that have a "publish" handler.
If "publish" is included in `Inputs.skipStages`, this stage will be skipped.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](../interfaces/IContext.md) | Global context object for Octorelease |
| `pluginsLoaded` | [`IPluginsLoaded`](../interfaces/IPluginsLoaded.md) | Key-value pairs of plugin names and loaded modules |

#### Returns

`Promise`<`void`\>

#### Defined in

[stages.ts:49](https://github.com/t1m0thyj/octorelease/blob/efbfdf0/packages/core/src/stages.ts#L49)

___

### success

▸ **success**(`context`, `pluginsLoaded`): `Promise`<`void`\>

Run "success" stage for loaded plugins that have a "success" handler.
If "success" is included in `Inputs.skipStages`, this stage will be skipped.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](../interfaces/IContext.md) | Global context object for Octorelease |
| `pluginsLoaded` | [`IPluginsLoaded`](../interfaces/IPluginsLoaded.md) | Key-value pairs of plugin names and loaded modules |

#### Returns

`Promise`<`void`\>

#### Defined in

[stages.ts:68](https://github.com/t1m0thyj/octorelease/blob/efbfdf0/packages/core/src/stages.ts#L68)

___

### version

▸ **version**(`context`, `pluginsLoaded`): `Promise`<`void`\>

Run "version" stage for loaded plugins that have a "version" handler.
If "version" is included in `Inputs.skipStages`, this stage will be skipped.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](../interfaces/IContext.md) | Global context object for Octorelease |
| `pluginsLoaded` | [`IPluginsLoaded`](../interfaces/IPluginsLoaded.md) | Key-value pairs of plugin names and loaded modules |

#### Returns

`Promise`<`void`\>

#### Defined in

[stages.ts:87](https://github.com/t1m0thyj/octorelease/blob/efbfdf0/packages/core/src/stages.ts#L87)
