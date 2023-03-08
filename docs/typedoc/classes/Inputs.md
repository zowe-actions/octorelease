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

- [ciSkip](Inputs.md#ciskip)
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

[inputs.ts:27](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/inputs.ts#L27)

## Accessors

### ciSkip

• `Static` `get` **ciSkip**(): `boolean`

Specify whether to detect [ci skip] in last commit message

#### Returns

`boolean`

#### Defined in

[inputs.ts:32](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/inputs.ts#L32)

___

### configDir

• `Static` `get` **configDir**(): `undefined` \| `string`

Custom directory to search for release configuration.

#### Returns

`undefined` \| `string`

#### Defined in

[inputs.ts:46](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/inputs.ts#L46)

___

### dryRun

• `Static` `get` **dryRun**(): `boolean`

Don't make any changes but report what would have been done.

#### Returns

`boolean`

#### Defined in

[inputs.ts:54](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/inputs.ts#L54)

___

### newVersion

• `Static` `get` **newVersion**(): `undefined` \| `string`

New version number that should be released.

#### Returns

`undefined` \| `string`

#### Defined in

[inputs.ts:68](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/inputs.ts#L68)

___

### skipStages

• `Static` `get` **skipStages**(): `string`[]

Comma-separated list of stages that should be skipped.

#### Returns

`string`[]

#### Defined in

[inputs.ts:75](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/inputs.ts#L75)

___

### workingDir

• `Static` `get` **workingDir**(): `undefined` \| `string`

Custom working directory to use instead of the project root.

#### Returns

`undefined` \| `string`

#### Defined in

[inputs.ts:83](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/inputs.ts#L83)
