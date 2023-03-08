[@octorelease/core](../README.md) / [Exports](../modules.md) / Logger

# Class: Logger

Class for logging messages to the console.

## Table of contents

### Constructors

- [constructor](Logger.md#constructor)

### Properties

- [pluginName](Logger.md#pluginname)

### Methods

- [debug](Logger.md#debug)
- [error](Logger.md#error)
- [info](Logger.md#info)
- [prependPluginName](Logger.md#prependpluginname)
- [warn](Logger.md#warn)

## Constructors

### constructor

• **new Logger**(`pluginName?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `pluginName?` | `string` |

#### Defined in

[logger.ts:29](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/logger.ts#L29)

## Properties

### pluginName

• `Optional` **pluginName**: `string`

Plugin name to prepend to log messages.

#### Defined in

[logger.ts:27](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/logger.ts#L27)

## Methods

### debug

▸ **debug**(`message`): `void`

Output debug level message with plugin name prepended.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Text to output |

#### Returns

`void`

#### Defined in

[logger.ts:37](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/logger.ts#L37)

___

### error

▸ **error**(`message`): `void`

Output error level message with plugin name prepended.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Text to output |

#### Returns

`void`

#### Defined in

[logger.ts:45](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/logger.ts#L45)

___

### info

▸ **info**(`message`): `void`

Output info level message with plugin name prepended.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Text to output |

#### Returns

`void`

#### Defined in

[logger.ts:53](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/logger.ts#L53)

___

### prependPluginName

▸ `Private` **prependPluginName**(`message`): `string`

If plugin name is defined for this logger, prepend it to message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Text to output |

#### Returns

`string`

Text with plugin name prepended

#### Defined in

[logger.ts:70](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/logger.ts#L70)

___

### warn

▸ **warn**(`message`): `void`

Output warning level message with plugin name prepended.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Text to output |

#### Returns

`void`

#### Defined in

[logger.ts:61](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/logger.ts#L61)
