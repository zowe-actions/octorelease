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

- Build packages outside the root [TypeScript project references](tsconfig.json) with `npx tsc -b packages/<name>`. Bundling does not type-check source.
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

Each published package owns `packages/<name>/CHANGELOG.md`. Add entries under `## Recent Changes`; the changelog plugin replaces that heading with the release version. A starting template is:

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
- After a release, add `## Recent Changes` above the versioned history.

## Release the GitHub Action

Action releases use repository tags such as `v1.2.3`; npm package releases use separate package-prefixed tags. To release the action:

1. Merge the code and generated bundles into `master`. Confirm CI passed for the release commit.
2. Open **Releases → Draft a new release**.
3. Create an unused version tag, such as `v1.2.3`, targeting the tested commit.
4. Select the previous action tag and **Generate release notes**.
5. Review the notes, add any upgrade instructions, and publish.
6. Check the [Update latest tag workflow](.github/workflows/update-tag.yml). Verify the major alias, such as `v1`, points to the release commit.
7. Test the action in a consumer workflow using the exact version tag.

See [GitHub's release-note instructions](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes) for the release form.

The tag must contain current `dist/` files: consumers execute the bundle from that tag. Creating an action release does not publish the npm workspaces.

## Release an npm package

The separate [Release workflow](.github/workflows/release.yml) publishes a selected package:

1. Update that package's changelog and merge its tested code and bundles.
2. Open **Actions → Release → Run workflow**, select the intended branch, choose a package, and enter a complete version. Enable dry run first; its default is not enabled in this repository's workflow.
3. Review the logs, then dispatch a real run. The workflow requires the `ZOWE_ACTIONS_NPM_TOKEN` secret and GitHub credentials permitted to update the repository.
4. Verify the npm package, its distribution tag, and the generated GitHub draft release and tarball.

The [package release configuration](.github/release.config.js):

- Uses package-prefixed tags, such as `core-1.2.3`.
- Allows up to minor bumps on `master` and prereleases on `next`.
- Uploads tarballs to a draft GitHub release.

Include the prerelease suffix in an explicit version when needed. The private root and run-script packages are not published.

The workflow compiles source but uses the **committed action bundle** for release orchestration. Rebuilding and committing bundles before dispatch is required.

## Keep documentation current

| Change | Update together |
| --- | --- |
| Action input or configuration default | `action.yml`, source comments, `docs/usage.md`, and an example. |
| Plugin handler or option | Package README, `docs/extending.md`, and handler tests. |
| Core API | Source docstrings, `docs/developer-guide.md`, and generated TypeDoc. |
| Build tools or release workflow | This guide and any commands copied into the root README. |

Keep the commit hook and CI checks aligned with these steps. When extending documentation checks, prioritize broken links, invalid configuration examples, and generated API docs that differ from their sources.
