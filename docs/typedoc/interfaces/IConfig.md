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

[doc/IConfig.ts:22](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IConfig.ts#L22)

___

### plugins

• **plugins**: [`PluginConfig`](../modules.md#pluginconfig)[]

Array of Octorelease plugin configurations

#### Defined in

[doc/IConfig.ts:27](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IConfig.ts#L27)

___

### tagPrefix

• **tagPrefix**: `string`

Git tag prefix that precedes version number (default is "v")

#### Defined in

[doc/IConfig.ts:32](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IConfig.ts#L32)
