[@octorelease/core](../README.md) / [Exports](../modules.md) / IContext

# Interface: IContext

Global context object for Octorelease

## Table of contents

### Properties

- [branch](IContext.md#branch)
- [changedFiles](IContext.md#changedfiles)
- [ci](IContext.md#ci)
- [dryRun](IContext.md#dryrun)
- [env](IContext.md#env)
- [failError](IContext.md#failerror)
- [logger](IContext.md#logger)
- [plugins](IContext.md#plugins)
- [releaseNotes](IContext.md#releasenotes)
- [releasedPackages](IContext.md#releasedpackages)
- [rootDir](IContext.md#rootdir)
- [tagPrefix](IContext.md#tagprefix)
- [version](IContext.md#version)
- [workspaces](IContext.md#workspaces)

## Properties

### branch

• **branch**: [`IProtectedBranch`](IProtectedBranch.md)

Properties for current Git branch

**`Example`**

```ts
{ name: "master", level: "minor" }
```

#### Defined in

[doc/IContext.ts:31](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IContext.ts#L31)

___

### changedFiles

• **changedFiles**: `string`[]

List of changed files to stage

**`Example`**

```ts
["package.json", "package-lock.json"]
```

#### Defined in

[doc/IContext.ts:37](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IContext.ts#L37)

___

### ci

• **ci**: `Object`

Properties for current CI environment

**`Example`**

```ts
{ branch: "master", commit: "deadbeef", repo: { owner: "octorelease", repo: "octorelease" } }
```

#### Defined in

[doc/IContext.ts:43](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IContext.ts#L43)

___

### dryRun

• **dryRun**: `boolean`

If true, don't make any changes but report what would have been done

#### Defined in

[doc/IContext.ts:53](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IContext.ts#L53)

___

### env

• **env**: `Record`<`string`, `string`\>

Environment variables

#### Defined in

[doc/IContext.ts:58](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IContext.ts#L58)

___

### failError

• `Optional` **failError**: `Error`

Error object defined for "fail" stage

#### Defined in

[doc/IContext.ts:63](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IContext.ts#L63)

___

### logger

• **logger**: [`Logger`](../classes/Logger.md)

Logger for writing to console

#### Defined in

[doc/IContext.ts:68](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IContext.ts#L68)

___

### plugins

• **plugins**: `Object`

Key-value pairs of plugin names and configuration objects

**`Example`**

```ts
{ "@octorelease/changelog": [], "@octorelease/github": [ { assets: "*.tgz" } ] }
```

#### Index signature

▪ [key: `string`]: `Record`<`string`, `any`\>[]

#### Defined in

[doc/IContext.ts:74](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IContext.ts#L74)

___

### releaseNotes

• `Optional` **releaseNotes**: `string`

Multi-line string containing changelog

#### Defined in

[doc/IContext.ts:85](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IContext.ts#L85)

___

### releasedPackages

• **releasedPackages**: `Object`

Key-value pairs of release types and released package info

**`Example`**

```ts
{ npm: [{ name: "@octorelease/core" }] }
```

#### Index signature

▪ [key: `string`]: [`IReleasedPackage`](IReleasedPackage.md)[]

#### Defined in

[doc/IContext.ts:80](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IContext.ts#L80)

___

### rootDir

• **rootDir**: `string`

Absolute path of project root directory

#### Defined in

[doc/IContext.ts:90](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IContext.ts#L90)

___

### tagPrefix

• **tagPrefix**: `string`

Git tag prefix that precedes version number (default is "v")

#### Defined in

[doc/IContext.ts:95](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IContext.ts#L95)

___

### version

• **version**: [`IVersionInfo`](IVersionInfo.md)

Version info including old and new project version

**`Example`**

```ts
{ old: "1.0.0", new: "1.0.1" }
```

#### Defined in

[doc/IContext.ts:101](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IContext.ts#L101)

___

### workspaces

• `Optional` **workspaces**: `string`[]

Subpackage paths or globs for monorepo

**`Example`**

```ts
["packages/*"]
```

#### Defined in

[doc/IContext.ts:107](https://github.com/zowe-actions/octorelease/blob/0333bce/packages/core/src/doc/IContext.ts#L107)
