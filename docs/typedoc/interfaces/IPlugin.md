[@octorelease/core](../README.md) / [Exports](../modules.md) / IPlugin

# Interface: IPlugin

Type for loaded plugin modules

## Table of contents

### Properties

- [fail](IPlugin.md#fail)
- [init](IPlugin.md#init)
- [publish](IPlugin.md#publish)
- [success](IPlugin.md#success)
- [version](IPlugin.md#version)

## Properties

### fail

• `Optional` **fail**: (`context`: [`IContext`](IContext.md), `config`: `Record`<`string`, `any`\>) => `Promise`<`void`\>

#### Type declaration

▸ (`context`, `config`): `Promise`<`void`\>

Handler for "fail" stage

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](IContext.md) | Global context object for Octorelease |
| `config` | `Record`<`string`, `any`\> | Plugin configuration object |

##### Returns

`Promise`<`void`\>

#### Defined in

[doc/IPlugin.ts:28](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IPlugin.ts#L28)

___

### init

• `Optional` **init**: (`context`: [`IContext`](IContext.md), `config`: `Record`<`string`, `any`\>) => `Promise`<`void`\>

#### Type declaration

▸ (`context`, `config`): `Promise`<`void`\>

Handler for "init" stage

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](IContext.md) | Global context object for Octorelease |
| `config` | `Record`<`string`, `any`\> | Plugin configuration object |

##### Returns

`Promise`<`void`\>

#### Defined in

[doc/IPlugin.ts:35](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IPlugin.ts#L35)

___

### publish

• `Optional` **publish**: (`context`: [`IContext`](IContext.md), `config`: `Record`<`string`, `any`\>) => `Promise`<`void`\>

#### Type declaration

▸ (`context`, `config`): `Promise`<`void`\>

Handler for "publish" stage

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](IContext.md) | Global context object for Octorelease |
| `config` | `Record`<`string`, `any`\> | Plugin configuration object |

##### Returns

`Promise`<`void`\>

#### Defined in

[doc/IPlugin.ts:42](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IPlugin.ts#L42)

___

### success

• `Optional` **success**: (`context`: [`IContext`](IContext.md), `config`: `Record`<`string`, `any`\>) => `Promise`<`void`\>

#### Type declaration

▸ (`context`, `config`): `Promise`<`void`\>

Handler for "success" stage

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](IContext.md) | Global context object for Octorelease |
| `config` | `Record`<`string`, `any`\> | Plugin configuration object |

##### Returns

`Promise`<`void`\>

#### Defined in

[doc/IPlugin.ts:49](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IPlugin.ts#L49)

___

### version

• `Optional` **version**: (`context`: [`IContext`](IContext.md), `config`: `Record`<`string`, `any`\>) => `Promise`<`void`\>

#### Type declaration

▸ (`context`, `config`): `Promise`<`void`\>

Handler for "version" stage

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`IContext`](IContext.md) | Global context object for Octorelease |
| `config` | `Record`<`string`, `any`\> | Plugin configuration object |

##### Returns

`Promise`<`void`\>

#### Defined in

[doc/IPlugin.ts:56](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IPlugin.ts#L56)
