[@octorelease/core](../README.md) / [Exports](../modules.md) / Logger

# Class: Logger

Class for logging messages to the console.

## Table of contents

### Constructors

- [constructor](Logger.md#constructor)

### Methods

- [debug](Logger.md#debug)
- [error](Logger.md#error)
- [info](Logger.md#info)
- [prependPluginName](Logger.md#prependpluginname)
- [warning](Logger.md#warning)

## Constructors

### constructor

• **new Logger**(`pluginName?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `pluginName?` | `string` |

#### Defined in

[logger.ts:7](https://github.com/t1m0thyj/octorelease/blob/efbfdf0/packages/core/src/logger.ts#L7)

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

[logger.ts:13](https://github.com/t1m0thyj/octorelease/blob/efbfdf0/packages/core/src/logger.ts#L13)

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

[logger.ts:21](https://github.com/t1m0thyj/octorelease/blob/efbfdf0/packages/core/src/logger.ts#L21)

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

[logger.ts:29](https://github.com/t1m0thyj/octorelease/blob/efbfdf0/packages/core/src/logger.ts#L29)

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

[logger.ts:46](https://github.com/t1m0thyj/octorelease/blob/efbfdf0/packages/core/src/logger.ts#L46)

___

### warning

▸ **warning**(`message`): `void`

Output warning level message with plugin name prepended.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Text to output |

#### Returns

`void`

#### Defined in

[logger.ts:37](https://github.com/t1m0thyj/octorelease/blob/efbfdf0/packages/core/src/logger.ts#L37)
