[**@octorelease/core**](../README.md)

***

[@octorelease/core](../globals.md) / IConfig

# Interface: IConfig

Defined in: [packages/core/src/doc/IConfig.ts:34](/packages/core/src/doc/IConfig.ts#L34)

Configuration object loaded from release config file

## Properties

### branches

> **branches**: [`BranchConfig`](../type-aliases/BranchConfig.md)[]

Defined in: [packages/core/src/doc/IConfig.ts:38](/packages/core/src/doc/IConfig.ts#L38)

Array of protected branch configurations

***

### plugins

> **plugins**: [`PluginConfig`](../type-aliases/PluginConfig.md)[]

Defined in: [packages/core/src/doc/IConfig.ts:43](/packages/core/src/doc/IConfig.ts#L43)

Array of Octorelease plugin configurations

***

### tagPrefix

> **tagPrefix**: `string`

Defined in: [packages/core/src/doc/IConfig.ts:48](/packages/core/src/doc/IConfig.ts#L48)

Git tag prefix that precedes version number (default is "v")
