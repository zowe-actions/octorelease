# Extending Octorelease

[Configuration](usage.md#plugins) · [Writing a plugin](developer-guide.md#writing-a-plugin)

## Official plugins

All official plugins live in [zowe-actions/octorelease](https://github.com/zowe-actions/octorelease).

- **GitHub Action:** includes all official release plugins.
- **CLI:** core includes changelog, Git, GitHub, and npm as optional dependencies. Install other plugins separately.
- **Configuration:** add plugins to the `plugins` array to enable them. Put Git after plugins that update release files.

### [@octorelease/changelog](../packages/changelog/README.md)

- `version`: Read release notes and update changelog version headings.

### [@octorelease/npm](../packages/npm/README.md)

- `init`: Read the package version and authenticate to the registry.
- `version`: Update the package version.
- `publish`: Create a tarball and publish the package.
- `success`: Optionally test installation of the published package.

### [@octorelease/lerna](../packages/lerna/README.md)

- `init`: Discover workspace packages, read versions, and authenticate to npm.
- `version`: Update package versions and the workspace lockfile.
- `publish`: Package and publish workspace members through npm.
- `success`: Optionally test installation of published packages.

Use Lerna in place of the npm plugin for workspace releases.

### [@octorelease/git](../packages/git/README.md)

- `init`: Configure Git identity and credentials.
- `version`: Commit release changes, tag the version, and push.

### [@octorelease/github](../packages/github/README.md)

- `init`: Optionally select a version from approved PR labels.
- `publish`: Create a GitHub release and upload assets.
- `success`: Update PR labels and post a release comment.
- `fail`: Remove release labels and post error details on the PR.

### [@octorelease/exec](../packages/exec/README.md)

- Any stage: Run a configured command.

### [@octorelease/pypi](../packages/pypi/README.md)

- `init`: Check Twine and publishing credentials.
- `publish`: Upload prebuilt Python distributions.

### [@octorelease/vsce](../packages/vsce/README.md)

- `init`: Validate publishing credentials.
- `publish`: Package and publish extensions to the VS Code Marketplace or Open VSX.

## Companion script action

Use [`zowe-actions/octorelease/script@v1`](../packages/run-script/README.md) to run the repository's helper scripts. Configure it as a separate workflow step, not an entry in `plugins`.

## Custom and community plugins

Plugins export one or more async handlers: `init`, `version`, `publish`, `success`, and `fail`. See [Writing a plugin](developer-guide.md#writing-a-plugin) for an example.

- Install external plugins in the release project's `node_modules`.
- Reference local CommonJS files with a path beginning `./`.
- Resolve paths from the release working directory.
- An installed official plugin takes precedence over the action's bundled copy.

```json
{
  "branches": ["main"],
  "plugins": ["./scripts/release-plugin.cjs"]
}
```

To list a community plugin here, [submit a pull request](../CONTRIBUTING.md#submitting-a-pull-request) with its repository, supported stages, installation command, and documentation.

## Reusing configuration

Import a shared configuration from a CommonJS file:

```js
// release.config.cjs
const shared = require("./config/release-base.cjs");
module.exports = {
  ...shared,
  branches: ["main", { name: "next", channel: "next", prerelease: true }],
};
```

- The imported module must export an Octorelease configuration object.
- Merge options in JavaScript; Octorelease has no built-in `extends` option.
- Use Octorelease plugins and options. semantic-release configuration is not compatible.
