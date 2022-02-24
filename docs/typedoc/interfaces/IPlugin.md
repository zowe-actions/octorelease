[@octorelease/core](../README.md) / [Exports](../modules.md) / IPlugin

# Interface: IPlugin

Type for loaded plugin modules

## Table of contents

### Methods

- [fail](IPlugin.md#fail)
- [init](IPlugin.md#init)
- [publish](IPlugin.md#publish)
- [success](IPlugin.md#success)
- [version](IPlugin.md#version)

## Methods

### fail

▸ `Optional` **fail**(`context`, `config`): `Promise`<`void`\>

Handler for "fail" stage

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](IContext.md) | Global context object for Octorelease |
| `config` | `Record`<`string`, `any`\> | Plugin configuration object |

#### Returns

`Promise`<`void`\>

#### Defined in

[doc/IPlugin.ts:12](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IPlugin.ts#L12)

___

### init

▸ `Optional` **init**(`context`, `config`): `Promise`<`void`\>

Handler for "init" stage

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](IContext.md) | Global context object for Octorelease |
| `config` | `Record`<`string`, `any`\> | Plugin configuration object |

#### Returns

`Promise`<`void`\>

#### Defined in

[doc/IPlugin.ts:19](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IPlugin.ts#L19)

___

### publish

▸ `Optional` **publish**(`context`, `config`): `Promise`<`void`\>

Handler for "publish" stage

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](IContext.md) | Global context object for Octorelease |
| `config` | `Record`<`string`, `any`\> | Plugin configuration object |

#### Returns

`Promise`<`void`\>

#### Defined in

[doc/IPlugin.ts:26](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IPlugin.ts#L26)

___

### success

▸ `Optional` **success**(`context`, `config`): `Promise`<`void`\>

Handler for "success" stage

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](IContext.md) | Global context object for Octorelease |
| `config` | `Record`<`string`, `any`\> | Plugin configuration object |

#### Returns

`Promise`<`void`\>

#### Defined in

[doc/IPlugin.ts:33](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IPlugin.ts#L33)

___

### version

▸ `Optional` **version**(`context`, `config`): `Promise`<`void`\>

Handler for "version" stage

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](IContext.md) | Global context object for Octorelease |
| `config` | `Record`<`string`, `any`\> | Plugin configuration object |

#### Returns

`Promise`<`void`\>

#### Defined in

[doc/IPlugin.ts:40](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IPlugin.ts#L40)
