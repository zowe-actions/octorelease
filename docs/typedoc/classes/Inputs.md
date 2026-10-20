[**@octorelease/core**](../README.md)

***

[@octorelease/core](../globals.md) / Inputs

# Class: Inputs

Defined in: [packages/core/src/inputs.ts:27](/packages/core/src/inputs.ts#L27)

Class for accessing GitHub action inputs.
If Octorelease is used outside of GitHub Actions, these inputs can be
supplied as environment variables. For example, the "dry-run" input is
associated with the "INPUT_DRY-RUN" environment variable.

## Constructors

### Constructor

> **new Inputs**(): `Inputs`

#### Returns

`Inputs`

## Properties

### rootDir

> `private` `readonly` `static` **rootDir**: `string`

Defined in: [packages/core/src/inputs.ts:28](/packages/core/src/inputs.ts#L28)

## Accessors

### ciSkip

#### Get Signature

> **get** `static` **ciSkip**(): `boolean`

Defined in: [packages/core/src/inputs.ts:33](/packages/core/src/inputs.ts#L33)

Specify whether to detect [ci skip] in last commit message

##### Returns

`boolean`

***

### configDir

#### Get Signature

> **get** `static` **configDir**(): `string` \| `undefined`

Defined in: [packages/core/src/inputs.ts:47](/packages/core/src/inputs.ts#L47)

Custom directory to search for release configuration.

##### Returns

`string` \| `undefined`

***

### dryRun

#### Get Signature

> **get** `static` **dryRun**(): `boolean`

Defined in: [packages/core/src/inputs.ts:55](/packages/core/src/inputs.ts#L55)

Don't make any changes but report what would have been done.

##### Returns

`boolean`

***

### newVersion

#### Get Signature

> **get** `static` **newVersion**(): `string` \| `undefined`

Defined in: [packages/core/src/inputs.ts:69](/packages/core/src/inputs.ts#L69)

New version number that should be released.

##### Returns

`string` \| `undefined`

***

### skipStages

#### Get Signature

> **get** `static` **skipStages**(): `string`[]

Defined in: [packages/core/src/inputs.ts:76](/packages/core/src/inputs.ts#L76)

Comma-separated list of stages that should be skipped.

##### Returns

`string`[]

***

### workingDir

#### Get Signature

> **get** `static` **workingDir**(): `string` \| `undefined`

Defined in: [packages/core/src/inputs.ts:84](/packages/core/src/inputs.ts#L84)

Custom working directory to use instead of the project root.

##### Returns

`string` \| `undefined`
