[**@octorelease/core**](../README.md)

***

[@octorelease/core](../globals.md) / IConfig

# Interface: IConfig

Defined in: [doc/IConfig.ts:34](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IConfig.ts#L34)

Configuration object loaded from release config file

## Properties

### branches

> **branches**: [`BranchConfig`](../type-aliases/BranchConfig.md)[]

Defined in: [doc/IConfig.ts:38](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IConfig.ts#L38)

Array of protected branch configurations

***

### plugins

> **plugins**: [`PluginConfig`](../type-aliases/PluginConfig.md)[]

Defined in: [doc/IConfig.ts:43](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IConfig.ts#L43)

Array of Octorelease plugin configurations

***

### tagPrefix

> **tagPrefix**: `string`

Defined in: [doc/IConfig.ts:48](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IConfig.ts#L48)

Git tag prefix that precedes version number (default is "v")
