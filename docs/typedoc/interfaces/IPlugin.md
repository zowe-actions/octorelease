[**@octorelease/core**](../README.md)

***

[@octorelease/core](../globals.md) / IPlugin

# Interface: IPlugin

Defined in: [doc/IPlugin.ts:22](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IPlugin.ts#L22)

Type for loaded plugin modules

## Properties

### fail?

> `optional` **fail?**: (`context`, `config`) => `Promise`\<`void`\>

Defined in: [doc/IPlugin.ts:28](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IPlugin.ts#L28)

Handler for "fail" stage

#### Parameters

##### context

[`IContext`](IContext.md)

Global context object for Octorelease

##### config

`Record`\<`string`, `any`\>

Plugin configuration object

#### Returns

`Promise`\<`void`\>

***

### init?

> `optional` **init?**: (`context`, `config`) => `Promise`\<`void`\>

Defined in: [doc/IPlugin.ts:35](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IPlugin.ts#L35)

Handler for "init" stage

#### Parameters

##### context

[`IContext`](IContext.md)

Global context object for Octorelease

##### config

`Record`\<`string`, `any`\>

Plugin configuration object

#### Returns

`Promise`\<`void`\>

***

### publish?

> `optional` **publish?**: (`context`, `config`) => `Promise`\<`void`\>

Defined in: [doc/IPlugin.ts:42](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IPlugin.ts#L42)

Handler for "publish" stage

#### Parameters

##### context

[`IContext`](IContext.md)

Global context object for Octorelease

##### config

`Record`\<`string`, `any`\>

Plugin configuration object

#### Returns

`Promise`\<`void`\>

***

### success?

> `optional` **success?**: (`context`, `config`) => `Promise`\<`void`\>

Defined in: [doc/IPlugin.ts:49](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IPlugin.ts#L49)

Handler for "success" stage

#### Parameters

##### context

[`IContext`](IContext.md)

Global context object for Octorelease

##### config

`Record`\<`string`, `any`\>

Plugin configuration object

#### Returns

`Promise`\<`void`\>

***

### version?

> `optional` **version?**: (`context`, `config`) => `Promise`\<`void`\>

Defined in: [doc/IPlugin.ts:56](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IPlugin.ts#L56)

Handler for "version" stage

#### Parameters

##### context

[`IContext`](IContext.md)

Global context object for Octorelease

##### config

`Record`\<`string`, `any`\>

Plugin configuration object

#### Returns

`Promise`\<`void`\>
