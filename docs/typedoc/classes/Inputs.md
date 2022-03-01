[@octorelease/core](../README.md) / [Exports](../modules.md) / Inputs

# Class: Inputs

Class for accessing GitHub action inputs.
If Octorelease is used outside of GitHub Actions, these inputs can be
supplied as environment variables. For example, the "dry-run" input is
associated with the "INPUT_DRY-RUN" environment variable.

## Table of contents

### Constructors

- [constructor](Inputs.md#constructor)

### Properties

- [rootDir](Inputs.md#rootdir)

### Accessors

- [configDir](Inputs.md#configdir)
- [dryRun](Inputs.md#dryrun)
- [newVersion](Inputs.md#newversion)
- [skipStages](Inputs.md#skipstages)
- [workingDir](Inputs.md#workingdir)

## Constructors

### constructor

• **new Inputs**()

## Properties

### rootDir

▪ `Static` `Private` `Readonly` **rootDir**: `string`

#### Defined in

[inputs.ts:27](https://github.com/t1m0thyj/octorelease/blob/11f83ae/packages/core/src/inputs.ts#L27)

## Accessors

### configDir

• `Static` `get` **configDir**(): `undefined` \| `string`

Custom directory to search for release configuration.

#### Returns

`undefined` \| `string`

#### Defined in

[inputs.ts:32](https://github.com/t1m0thyj/octorelease/blob/11f83ae/packages/core/src/inputs.ts#L32)

___

### dryRun

• `Static` `get` **dryRun**(): `boolean`

Don't make any changes but report what would have been done.

#### Returns

`boolean`

#### Defined in

[inputs.ts:40](https://github.com/t1m0thyj/octorelease/blob/11f83ae/packages/core/src/inputs.ts#L40)

___

### newVersion

• `Static` `get` **newVersion**(): `undefined` \| `string`

New version number that should be released.

#### Returns

`undefined` \| `string`

#### Defined in

[inputs.ts:54](https://github.com/t1m0thyj/octorelease/blob/11f83ae/packages/core/src/inputs.ts#L54)

___

### skipStages

• `Static` `get` **skipStages**(): `string`[]

Comma-separated list of stages that should be skipped.

#### Returns

`string`[]

#### Defined in

[inputs.ts:61](https://github.com/t1m0thyj/octorelease/blob/11f83ae/packages/core/src/inputs.ts#L61)

___

### workingDir

• `Static` `get` **workingDir**(): `undefined` \| `string`

Custom working directory to use instead of the project root.

#### Returns

`undefined` \| `string`

#### Defined in

[inputs.ts:69](https://github.com/t1m0thyj/octorelease/blob/11f83ae/packages/core/src/inputs.ts#L69)
