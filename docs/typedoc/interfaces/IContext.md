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
- [tagPrefix](IContext.md#tagprefix)
- [version](IContext.md#version)
- [workspaces](IContext.md#workspaces)

## Properties

### branch

• **branch**: [`IProtectedBranch`](IProtectedBranch.md)

Properties for current Git branch

**`example`** { name: "master", level: "minor" }

#### Defined in

[doc/IContext.ts:15](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IContext.ts#L15)

___

### changedFiles

• **changedFiles**: `string`[]

List of changed files to stage

**`example`** ["package.json", "package-lock.json"]

#### Defined in

[doc/IContext.ts:21](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IContext.ts#L21)

___

### ci

• **ci**: `AppveyorEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `BambooEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `BitbucketEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `BitriseEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `BuddyEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `BuildkiteEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `CircleCiEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `CirrusEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `CodeBuildEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `CodefreshEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `CodeshipEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `DroneEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `GitLabEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `JenkinsEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `SailEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `SemaphoreEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `ShippableEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `TeamCityEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `TravisEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `VstsEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  } & `WerckerEnv` & { `repo`: { `owner`: `string` ; `repo`: `string`  }  }

Properties for current CI environment

**`example`** { branch: "master", commit: "deadbeef", repo: { owner: "octorelease", repo: "octorelease" } }

#### Defined in

[doc/IContext.ts:27](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IContext.ts#L27)

___

### dryRun

• **dryRun**: `boolean`

If true, don't make any changes but report what would have been done

#### Defined in

[doc/IContext.ts:37](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IContext.ts#L37)

___

### env

• **env**: `Record`<`string`, `string`\>

Environment variables

#### Defined in

[doc/IContext.ts:42](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IContext.ts#L42)

___

### failError

• `Optional` **failError**: `Error`

Error object defined for "fail" stage

#### Defined in

[doc/IContext.ts:47](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IContext.ts#L47)

___

### logger

• **logger**: [`Logger`](../classes/Logger.md)

Logger for writing to console

#### Defined in

[doc/IContext.ts:52](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IContext.ts#L52)

___

### plugins

• **plugins**: `Object`

Key-value pairs of plugin names and configuration objects

**`example`** { "@octorelease/changelog": {}, "@octorelease/github": { assets: "*.tgz" } }

#### Index signature

▪ [key: `string`]: `Record`<`string`, `any`\>

#### Defined in

[doc/IContext.ts:58](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IContext.ts#L58)

___

### releaseNotes

• `Optional` **releaseNotes**: `string`

Multi-line string containing changelog

#### Defined in

[doc/IContext.ts:69](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IContext.ts#L69)

___

### releasedPackages

• **releasedPackages**: `Object`

Key-value pairs of release types and released package info

**`example`** { npm: [{ name: "@octorelease/core" }] }

#### Index signature

▪ [key: `string`]: [`IReleasedPackage`](IReleasedPackage.md)[]

#### Defined in

[doc/IContext.ts:64](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IContext.ts#L64)

___

### tagPrefix

• **tagPrefix**: `string`

Git tag prefix that precedes version number (default is "v")

#### Defined in

[doc/IContext.ts:74](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IContext.ts#L74)

___

### version

• **version**: [`IVersionInfo`](IVersionInfo.md)

Version info including old and new project version

**`example`** { old: "1.0.0", new: "1.0.1" }

#### Defined in

[doc/IContext.ts:80](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IContext.ts#L80)

___

### workspaces

• `Optional` **workspaces**: `string`[]

Subpackage paths or globs for monorepo

**`example`** ["packages/*"]

#### Defined in

[doc/IContext.ts:86](https://github.com/t1m0thyj/octorelease/blob/efddc9a/packages/core/src/doc/IContext.ts#L86)
