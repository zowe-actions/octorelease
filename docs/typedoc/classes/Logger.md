[**@octorelease/core**](../README.md)

***

[@octorelease/core](../globals.md) / Logger

# Class: Logger

Defined in: [logger.ts:22](https://github.com/zowe-actions/octorelease/blob/chore/add-dev-docs/packages/core/src/logger.ts#L22)

Class for logging messages to the console.

## Constructors

### Constructor

> **new Logger**(`prefix?`): `Logger`

Defined in: [logger.ts:29](https://github.com/zowe-actions/octorelease/blob/chore/add-dev-docs/packages/core/src/logger.ts#L29)

#### Parameters

##### prefix?

`string`

#### Returns

`Logger`

## Properties

### prefix?

> `private` `optional` **prefix?**: `string`

Defined in: [logger.ts:29](https://github.com/zowe-actions/octorelease/blob/chore/add-dev-docs/packages/core/src/logger.ts#L29)

***

### pluginPathMap

> `static` **pluginPathMap**: `Record`\<`string`, `string`\> = `{}`

Defined in: [logger.ts:27](https://github.com/zowe-actions/octorelease/blob/chore/add-dev-docs/packages/core/src/logger.ts#L27)

**`Internal`**

Mapping of plugin names to their file paths

## Methods

### addPrefix()

> `private` **addPrefix**(`message`): `string`

Defined in: [logger.ts:68](https://github.com/zowe-actions/octorelease/blob/chore/add-dev-docs/packages/core/src/logger.ts#L68)

If prefix is defined for this logger, prepend it to message.

#### Parameters

##### message

`string`

Text to output

#### Returns

`string`

Text with prefix prepended

***

### debug()

> **debug**(`message`): `void`

Defined in: [logger.ts:35](https://github.com/zowe-actions/octorelease/blob/chore/add-dev-docs/packages/core/src/logger.ts#L35)

Output debug level message with plugin name prepended.

#### Parameters

##### message

`string`

Text to output

#### Returns

`void`

***

### error()

> **error**(`message`): `void`

Defined in: [logger.ts:43](https://github.com/zowe-actions/octorelease/blob/chore/add-dev-docs/packages/core/src/logger.ts#L43)

Output error level message with plugin name prepended.

#### Parameters

##### message

`string`

Text to output

#### Returns

`void`

***

### getPluginName()

> `private` **getPluginName**(): `string` \| `undefined`

Defined in: [logger.ts:77](https://github.com/zowe-actions/octorelease/blob/chore/add-dev-docs/packages/core/src/logger.ts#L77)

Searches the call stack for file paths associated with a plugin.

#### Returns

`string` \| `undefined`

Name of active plugin if one is found

***

### info()

> **info**(`message`): `void`

Defined in: [logger.ts:51](https://github.com/zowe-actions/octorelease/blob/chore/add-dev-docs/packages/core/src/logger.ts#L51)

Output info level message with plugin name prepended.

#### Parameters

##### message

`string`

Text to output

#### Returns

`void`

***

### warn()

> **warn**(`message`): `void`

Defined in: [logger.ts:59](https://github.com/zowe-actions/octorelease/blob/chore/add-dev-docs/packages/core/src/logger.ts#L59)

Output warning level message with plugin name prepended.

#### Parameters

##### message

`string`

Text to output

#### Returns

`void`
