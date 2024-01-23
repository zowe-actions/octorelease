[@octorelease/core](../README.md) / [Exports](../modules.md) / Logger

# Class: Logger

Class for logging messages to the console.

## Table of contents

### Constructors

- [constructor](Logger.md#constructor)

### Properties

- [prefix](Logger.md#prefix)
- [pluginPathMap](Logger.md#pluginpathmap)

### Methods

- [addPrefix](Logger.md#addprefix)
- [debug](Logger.md#debug)
- [error](Logger.md#error)
- [getPluginName](Logger.md#getpluginname)
- [info](Logger.md#info)
- [warn](Logger.md#warn)

## Constructors

### constructor

• **new Logger**(`prefix?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `prefix?` | `string` |

#### Defined in

[logger.ts:29](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/logger.ts#L29)

## Properties

### prefix

• `Private` `Optional` **prefix**: `string`

#### Defined in

[logger.ts:29](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/logger.ts#L29)

___

### pluginPathMap

▪ `Static` **pluginPathMap**: `Record`<`string`, `string`\> = `{}`

Mapping of plugin names to their file paths

#### Defined in

[logger.ts:27](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/logger.ts#L27)

## Methods

### addPrefix

▸ `Private` **addPrefix**(`message`): `string`

If prefix is defined for this logger, prepend it to message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Text to output |

#### Returns

`string`

Text with prefix prepended

#### Defined in

[logger.ts:68](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/logger.ts#L68)

___

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

[logger.ts:35](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/logger.ts#L35)

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

[logger.ts:43](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/logger.ts#L43)

___

### getPluginName

▸ `Private` **getPluginName**(): `undefined` \| `string`

Searches the call stack for file paths associated with a plugin.

#### Returns

`undefined` \| `string`

Name of active plugin if one is found

#### Defined in

[logger.ts:77](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/logger.ts#L77)

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

[logger.ts:51](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/logger.ts#L51)

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

[logger.ts:59](https://github.com/zowe-actions/octorelease/blob/3eb8460/packages/core/src/logger.ts#L59)
