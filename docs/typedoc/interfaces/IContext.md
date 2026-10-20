[**@octorelease/core**](../README.md)

***

[@octorelease/core](../globals.md) / IContext

# Interface: IContext

Defined in: [doc/IContext.ts:26](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L26)

Global context object for Octorelease

## Properties

### branch

> **branch**: [`IProtectedBranch`](IProtectedBranch.md)

Defined in: [doc/IContext.ts:31](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L31)

Properties for current Git branch

#### Example

```ts
{ name: "master", level: "minor" }
```

***

### changedFiles

> **changedFiles**: `string`[]

Defined in: [doc/IContext.ts:37](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L37)

List of changed files to stage

#### Example

```ts
["package.json", "package-lock.json"]
```

***

### ci

> **ci**: `KnownCiEnv` & `object`

Defined in: [doc/IContext.ts:43](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L43)

Properties for current CI environment

#### Type Declaration

##### repo

> **repo**: `object`

###### repo.owner

> **owner**: `string`

###### repo.repo

> **repo**: `string`

#### Example

```ts
{ branch: "master", commit: "deadbeef", repo: { owner: "octorelease", repo: "octorelease" } }
```

***

### dryRun

> **dryRun**: `boolean`

Defined in: [doc/IContext.ts:53](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L53)

If true, don't make any changes but report what would have been done

***

### env

> **env**: `Record`\<`string`, `string`\>

Defined in: [doc/IContext.ts:58](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L58)

Environment variables

***

### failError?

> `optional` **failError?**: `Error`

Defined in: [doc/IContext.ts:63](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L63)

Error object defined for "fail" stage

***

### logger

> **logger**: [`Logger`](../classes/Logger.md)

Defined in: [doc/IContext.ts:68](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L68)

Logger for writing to console

***

### plugins

> **plugins**: `object`

Defined in: [doc/IContext.ts:74](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L74)

Key-value pairs of plugin names and configuration objects

#### Index Signature

\[`key`: `string`\]: `Record`\<`string`, `any`\>[]

#### Example

```ts
{ "@octorelease/changelog": [], "@octorelease/github": [ { assets: "*.tgz" } ] }
```

***

### releasedPackages

> **releasedPackages**: `object`

Defined in: [doc/IContext.ts:80](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L80)

Key-value pairs of release types and released package info

#### Index Signature

\[`key`: `string`\]: [`IReleasedPackage`](IReleasedPackage.md)[]

#### Example

```ts
{ npm: [{ name: "@octorelease/core" }] }
```

***

### releaseNotes?

> `optional` **releaseNotes?**: `string`

Defined in: [doc/IContext.ts:85](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L85)

Multi-line string containing changelog

***

### rootDir

> **rootDir**: `string`

Defined in: [doc/IContext.ts:90](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L90)

Absolute path of project root directory

***

### tagPrefix

> **tagPrefix**: `string`

Defined in: [doc/IContext.ts:95](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L95)

Git tag prefix that precedes version number (default is "v")

***

### version

> **version**: [`IVersionInfo`](IVersionInfo.md)

Defined in: [doc/IContext.ts:101](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L101)

Version info including old and new project version

#### Example

```ts
{ old: "1.0.0", new: "1.0.1" }
```

***

### workspaces?

> `optional` **workspaces?**: `string`[]

Defined in: [doc/IContext.ts:107](https://github.com/zowe-actions/octorelease/blob/chore/update-typedoc/packages/core/src/doc/IContext.ts#L107)

Subpackage paths or globs for monorepo

#### Example

```ts
["packages/*"]
```
