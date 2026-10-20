# Contributing to Octorelease

[Architecture and plugin API](docs/developer-guide.md) · [Troubleshooting](docs/support.md) · [Usage](docs/usage.md)

Read the [design principles](docs/developer-guide.md#design-principles) before changing core or plugins: CI independence, language independence, and recoverable builds.

## Set up the repository

Install Git, Node.js, and npm. Use a Node.js version covered by the [test workflow](.github/workflows/test.yml), then work from the repository root:

```sh
git clone https://github.com/zowe-actions/octorelease.git
cd octorelease
npm ci
npm run all
```

Use `npm ci` to install the dependencies recorded in the lockfile and run the repository setup scripts.

- `@octorelease/workspace`: private root package for development tools and workspace management.
- `packages/core`: published CLI and plugin APIs.
- Other packages: release plugins and the companion script action.

## How stages and plugins fit together

Core loads the configuration and runs the configured plugins:

1. `init`: gather release information and check prerequisites.
2. Validate the version.
3. `version`: prepare files, commits, and tags.
4. `publish`: distribute packages and assets.
5. `success`: run follow-up checks and notifications.

- Plugins run in configuration order within each stage.
- Each plugin exports only the handlers it needs.
- Handlers share a context containing versions, release notes, changed files, and published packages.
- On error, `fail` handlers report the problem. They do not roll back completed operations.

See the [architecture diagram](docs/developer-guide.md#architecture) and [plugin example](docs/developer-guide.md#writing-a-plugin).

## Build and test

| Command | What it does |
| --- | --- |
| `npm run build` | Updates license headers and compiles the root TypeScript project references. |
| `npm run lint` | Checks and **rewrites** formatting with Biome under `packages/`. |
| `npm run pack` | Bundles every workspace for the GitHub Action. This is a custom script, not `npm pack`. |
| `npm test` | Runs the root Vitest suite, including tests in workspace packages. |
| `npm test -- packages/core/__tests__/stages.test.ts` | Runs a focused test file. |
| `npm run typedoc` | Regenerates the checked-in core API reference. |
| `npm run all` | Runs build, lint, pack, and tests in that order. |

**Rebuild the bundle before testing changes through `uses: ./` or `node dist/index.js`.** Those entry points do not read TypeScript source or compiled `lib/` files:

```sh
npm run build
npm run pack
npm test
```

- Keep new packages in the root [TypeScript project references](tsconfig.json). Bundling does not type-check source.
- Check CI results for integration tests of the release command and action.
- Use a disposable CI checkout for dry runs; [local preparation still runs](docs/support.md#what-does-a-dry-run-change). See the [test workflow](.github/workflows/test.yml).
- The [pre-commit hook](.husky/pre-commit) runs `pack` and `typedoc`, then stages generated files. Run the build and tests yourself.
- Review generated changes before committing. CI runs `npm run all` and checks for a dirty working tree.

## Submitting a pull request

1. Branch from `master`; keep the change focused.
2. Update tests for behavior changes and docs for affected users.
3. Add a package changelog entry for user-visible changes.
4. Run `npm run all`. Regenerate TypeDoc if APIs or comments changed.
5. Review and include generated files.
6. Open a PR against `master` with the problem, resulting behavior, compatibility impact, and test results.

Do not edit bundles or generated API pages directly. Fix their sources and regenerate them.

## Changelog entries

Each published package owns `packages/<name>/CHANGELOG.md`. Add entries under `## Recent Changes`. A starting template is:

```markdown
# Changelog

## Recent Changes

### Added

- Describe a new capability and when someone would use it.

### Fixed

- Describe the failing case and the corrected behavior.

### Changed

- Describe a changed default or required migration step.
```

- Keep only categories with entries.
- Use `###` for categories; the next `##` heading ends the release notes.
- The automatic prerelease workflow leaves changelogs unchanged.
- When preparing release notes, move the relevant entries under a version heading and keep `## Recent Changes` for new work.

## First change and releases

See the [maintainer guide](docs/maintainer-guide.md) for:

- A first change from source through tests and bundle verification.
- Automatic package prereleases from `master` and tagged action releases.
- Versioning, dependency updates, and release verification.

## Keep documentation current

| Change | Update together |
| --- | --- |
| Action input or configuration default | `action.yml`, source comments, `docs/usage.md`, and an example. |
| Plugin handler or option | Package README, `docs/extending.md`, and handler tests. |
| Core API | Source docstrings, `docs/developer-guide.md`, and generated TypeDoc. |
| Build tools or release workflow | This guide, the maintainer guide, and any commands copied into the root README. |

Keep the commit hook and CI checks aligned with these steps. When extending documentation checks, prioritize broken links, invalid configuration examples, and generated API docs that differ from their sources.
