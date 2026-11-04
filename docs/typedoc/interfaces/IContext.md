[**@octorelease/core**](../README.md)

***

[@octorelease/core](../globals.md) / IContext

# Interface: IContext

Defined in: [doc/IContext.ts:27](/packages/core/src/doc/IContext.ts#L27)

Global context object for Octorelease

## Properties

### branch

> **branch**: [`IProtectedBranch`](IProtectedBranch.md)

Defined in: [doc/IContext.ts:38](/packages/core/src/doc/IContext.ts#L38)

Properties for current Git branch

#### Example

```ts
{ name: "master", level: "minor" }
```

***

### changedFiles

> **changedFiles**: `string`[]

Defined in: [doc/IContext.ts:44](/packages/core/src/doc/IContext.ts#L44)

List of changed files to stage

#### Example

```ts
["package.json", "package-lock.json"]
```

***

### ci

> **ci**: `KnownCiEnv` & `object`

Defined in: [doc/IContext.ts:50](/packages/core/src/doc/IContext.ts#L50)

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

Defined in: [doc/IContext.ts:60](/packages/core/src/doc/IContext.ts#L60)

If true, don't make any changes but report what would have been done

***

### env

> **env**: `Record`\<`string`, `string`\>

Defined in: [doc/IContext.ts:65](/packages/core/src/doc/IContext.ts#L65)

Environment variables

***

### failError?

> `optional` **failError?**: `Error`

Defined in: [doc/IContext.ts:70](/packages/core/src/doc/IContext.ts#L70)

Error object defined for "fail" stage

***

### logger

> **logger**: [`Logger`](../classes/Logger.md)

Defined in: [doc/IContext.ts:75](/packages/core/src/doc/IContext.ts#L75)

Logger for writing to console

***

### packageReleases?

> `optional` **packageReleases?**: [`IPackageRelease`](IPackageRelease.md)[]

Defined in: [doc/IContext.ts:29](/packages/core/src/doc/IContext.ts#L29)

Independent release plan; undefined for shared versioning.

***

### plugins

> **plugins**: `object`

Defined in: [doc/IContext.ts:81](/packages/core/src/doc/IContext.ts#L81)

Key-value pairs of plugin names and configuration objects

#### Index Signature

\[`key`: `string`\]: `Record`\<`string`, `any`\>[]

#### Example

```ts
{ "@octorelease/changelog": [], "@octorelease/github": [ { assets: "*.tgz" } ] }
```

***

### releaseCommit?

> `optional` **releaseCommit?**: `string`

Defined in: [doc/IContext.ts:32](/packages/core/src/doc/IContext.ts#L32)

Commit shared by every Git tag in this release.

***

### releasedPackages

> **releasedPackages**: `object`

Defined in: [doc/IContext.ts:87](/packages/core/src/doc/IContext.ts#L87)

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

Defined in: [doc/IContext.ts:92](/packages/core/src/doc/IContext.ts#L92)

Multi-line string containing changelog

***

### rootDir

> **rootDir**: `string`

Defined in: [doc/IContext.ts:97](/packages/core/src/doc/IContext.ts#L97)

Absolute path of project root directory

***

### tagPrefix

> **tagPrefix**: `string`

Defined in: [doc/IContext.ts:102](/packages/core/src/doc/IContext.ts#L102)

Git tag prefix that precedes version number (default is "v")

***

### version

> **version**: [`IVersionInfo`](IVersionInfo.md)

Defined in: [doc/IContext.ts:108](/packages/core/src/doc/IContext.ts#L108)

Version info including old and new project version

#### Example

```ts
{ old: "1.0.0", new: "1.0.1" }
```

***

### workspaces?

> `optional` **workspaces?**: `string`[]

Defined in: [doc/IContext.ts:114](/packages/core/src/doc/IContext.ts#L114)

Subpackage paths or globs for monorepo

#### Example

```ts
["packages/*"]
```
