[@octorelease/core](../README.md) / [Exports](../modules.md) / IConfig

# Interface: IConfig

Configuration object loaded from release config file

## Table of contents

### Properties

- [branches](IConfig.md#branches)
- [plugins](IConfig.md#plugins)
- [tagPrefix](IConfig.md#tagprefix)

## Properties

### branches

• **branches**: [`BranchConfig`](../modules.md#branchconfig)[]

Array of protected branch configurations

#### Defined in

[doc/IConfig.ts:38](https://github.com/t1m0thyj/octorelease/blob/11f83ae/packages/core/src/doc/IConfig.ts#L38)

___

### plugins

• **plugins**: [`PluginConfig`](../modules.md#pluginconfig)[]

Array of Octorelease plugin configurations

#### Defined in

[doc/IConfig.ts:43](https://github.com/t1m0thyj/octorelease/blob/11f83ae/packages/core/src/doc/IConfig.ts#L43)

___

### tagPrefix

• **tagPrefix**: `string`

Git tag prefix that precedes version number (default is "v")

#### Defined in

[doc/IConfig.ts:48](https://github.com/t1m0thyj/octorelease/blob/11f83ae/packages/core/src/doc/IConfig.ts#L48)
