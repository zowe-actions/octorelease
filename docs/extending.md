# Extending

## Plugins list

### Official plugins

- [@octorelease/changelog]()
  - `init`: Gather release notes from the package changelog(s)
  - `version`: Update the version numbers in the package changelog(s)
- [@octorelease/git]()
  - `init`: Configure user name and email to be used for Git commits
  - `version`: Commit changed files, tag the new version, and push these changes
- [@octorelease/github]()
  - `init`: Prompt for semantic release label on associated pull request
  - `version`: Publish a new release to GitHub and upload assets
  - `success`: Add "released" label to associated pull request
  - `fail`: Remove semantic release label on associated pull request
- [@octorelease/lerna]()
  - `init`: Load version numbers from lerna.json and login to NPM registry
  - `version`: Bump changed package versions with lerna CLI
  - `publish`: Publish the new package versions to NPM registry
  - `success`: Verify that new package versions can be installed successfully
- [@octorelease/npm]()
  - `init`: Load version numbers from package.json and login to NPM registry
  - `version`: Bump the package version with npm CLI
  - `publish`: Publish the new package version to NPM registry
  - `success`: Verify that new package version can be installed successfully

### Community plugins

[Open a Pull Request](https://github.com/t1m0thyj/octorelease/blob/master/CONTRIBUTING.md#submitting-a-pull-request) to add your plugin to the list.

## Shareable configurations list

### Official configurations

- [@octorelease/zowe-config]() - Octorelease shareable configuration for releasing Zowe packages

### Community configurations
