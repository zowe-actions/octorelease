[**@octorelease/core**](../README.md)

***

[@octorelease/core](../globals.md) / IPlugin

# Interface: IPlugin

Defined in: [packages/core/src/doc/IPlugin.ts:25](/packages/core/src/doc/IPlugin.ts#L25)

Named async handlers exported by a plugin module.
Core awaits each handler and ignores its return value. Handlers communicate
through the shared context and throw an Error to fail the stage. Each plugin
is responsible for respecting `context.dryRun` before making changes.

## Properties

### fail?

> `optional` **fail?**: (`context`, `config`) => `Promise`\<`void`\>

Defined in: [packages/core/src/doc/IPlugin.ts:31](/packages/core/src/doc/IPlugin.ts#L31)

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

Defined in: [packages/core/src/doc/IPlugin.ts:38](/packages/core/src/doc/IPlugin.ts#L38)

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

Defined in: [packages/core/src/doc/IPlugin.ts:45](/packages/core/src/doc/IPlugin.ts#L45)

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

Defined in: [packages/core/src/doc/IPlugin.ts:52](/packages/core/src/doc/IPlugin.ts#L52)

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

Defined in: [packages/core/src/doc/IPlugin.ts:59](/packages/core/src/doc/IPlugin.ts#L59)

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
