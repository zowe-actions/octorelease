# Extending

## Official plugins

- [@octorelease/changelog](https://github.com/octorelease/octorelease/tree/master/packages/changelog)
  - **Note:** this is already part of @octorelease/core and does not have to be installed separately
  - `init`: Gather release notes from the package changelog(s)
  - `version`: Update the version numbers in the package changelog(s)
- [@octorelease/git](https://github.com/octorelease/octorelease/tree/master/packages/git)
  - **Note:** this is already part of @octorelease/core and does not have to be installed separately
  - `init`: Configure user name and email to be used for Git commits
  - `version`: Commit changed files, tag the new version, and push these changes
- [@octorelease/github](https://github.com/octorelease/octorelease/tree/master/packages/github)
  - **Note:** this is already part of @octorelease/core and does not have to be installed separately
  - `init`: Prompt for semantic release label on associated pull request
  - `version`: Publish a new release to GitHub and upload assets
  - `success`: Add "released" label to associated pull request
  - `fail`: Remove semantic release label on associated pull request
- [@octorelease/npm](https://github.com/octorelease/octorelease/tree/master/packages/npm)
  - **Note:** this is already part of @octorelease/core and does not have to be installed separately
  - `init`: Load version numbers from package.json and login to NPM registry
  - `version`: Bump the package version with npm CLI
  - `publish`: Publish the new package version to NPM registry
  - `success`: Verify that new package version can be installed successfully
- [@octorelease/exec](https://github.com/octorelease/octorelease/tree/master/packages/exec)
  - For All Stages: Execute a shell command during this stage
- [@octorelease/lerna](https://github.com/octorelease/octorelease/tree/master/packages/lerna)
  - `init`: Load version numbers from lerna.json and login to NPM registry
  - `version`: Bump changed package versions with lerna CLI
  - `publish`: Publish the new package versions to NPM registry
  - `success`: Verify that new package versions can be installed successfully
- [@octorelease/pypi](https://github.com/octorelease/octorelease/tree/master/packages/pypi)
  - `init`: Verify that `twine` is installed and configured
  - `publish`: Publish packages in dist folder to PyPI registry
- [@octorelease/vsce](https://github.com/octorelease/octorelease/tree/master/packages/vsce)
  - `init`: Verify personal access tokens to publish to VSIX registry
  - `publish`: Publish the new extension to VS Code marketplace and/or OVSX registry

## Community plugins

[Open a Pull Request](https://github.com/octorelease/octorelease/blob/master/CONTRIBUTING.md#submitting-a-pull-request) to add your plugin to the list.

<!-- ## Shareable configurations

- [octorelease-zowe-config](https://github.com/t1m0thyj/octorelease-zowe-config) - Octorelease shareable configuration for releasing Zowe packages -->
