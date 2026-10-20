# Recipes

[Configuration reference](usage.md#configuration) · [Manual GitHub workflow](usage.md#workflow-configuration) · [Troubleshooting](support.md)

## Release after a push

Before enabling this workflow:

- Add a [release configuration](usage.md#configuration) with your release branch in `branches`.
- Commit the intended package version and changelog.
- To select bumps from PR labels instead, enable `checkPrLabels` and put npm before GitHub in the plugin list.

```yaml
name: Release
on:
  push:
    branches: [main]
permissions:
  contents: write
  issues: write
  pull-requests: write
concurrency:
  group: release-${{ github.ref }}
  cancel-in-progress: false
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          ref: ${{ github.ref }}
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
      - uses: zowe-actions/octorelease@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          GIT_COMMITTER_NAME: GitHub Actions
          GIT_COMMITTER_EMAIL: actions@github.com
        with:
          dry-run: true
```

- Review the dry run, then set `dry-run: false` to publish on future pushes.
- Check that the checkout identity can push version commits under your branch protection rules.
- For manual releases, use the [workflow in Usage](usage.md#workflow-configuration).

## Release a subpackage with shared configuration

Keep configuration at `.github/release.config.cjs` and execute plugins from the package directory:

```yaml
- uses: zowe-actions/octorelease@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
    GIT_COMMITTER_NAME: GitHub Actions
    GIT_COMMITTER_EMAIL: actions@github.com
  with:
    config-dir: .github
    working-dir: packages/api
    new-version: '1.2.3'
    dry-run: true
```

- Set a package-specific `tagPrefix`, such as `api-`.
- `config-dir` resolves from the original checkout directory.
- Plugin paths and package files resolve from `working-dir`.
- For CLI use, install plugins where the loader can resolve them. The action can use its bundled official plugins.

## Jenkins

Prepare the Jenkins agent and project:

- Install Node.js, npm, and Git.
- Check out full history and tags; disable shallow cloning.
- Install `@octorelease/core` as a dev dependency.
- Commit the [release configuration](usage.md#configuration).
- Replace the example credential IDs and Git identity. Configure checkout credentials if Git will push.

```groovy
pipeline {
    agent any
    environment {
        GITHUB_TOKEN = credentials('github-release-token')
        NPM_TOKEN = credentials('npm-release-token')
        GIT_COMMITTER_NAME = 'Release Bot'
        GIT_COMMITTER_EMAIL = 'release-bot@example.com'
    }
    stages {
        stage('Install') {
            steps { sh 'npm ci' }
        }
        stage('Build and test') {
            steps {
                sh 'npm run build --if-present'
                sh 'npm test'
            }
        }
        stage('Preview release') {
            steps {
                sh "env 'INPUT_DRY-RUN=true' npx octorelease"
            }
        }
    }
}
```

- Remove `INPUT_DRY-RUN=true` after validating the preview to enable publishing.
- Without an explicit version or PR label selection, npm uses the version in `package.json`.
