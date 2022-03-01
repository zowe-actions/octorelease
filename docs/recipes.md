# Recipes

## CI Configurations

### GitHub Actions

The following is a minimal configuration for Octorelease with a build running on the latest LTS version of Node when a new commit is pushed to a `master` branch.

```yaml
name: Release

on:
  push:
    branches:
      - master

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v2
      with:
        fetch-depth: 0

    - name: Setup Node
      uses: actions/setup-node@v2
      with:
        node-version: 'lts/*'

    - name: Install Dependencies
      run: npm ci

    - name: Publish Release
      uses: octorelease/octorelease@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Notes:**
* To keep `package.json` updated in the `master` branch, [`@octorelease/git`](https://github.com/octorelease/octorelease/tree/master/packages/git) plugin can be used.
  * To allow the workflow to be rerun after changes have been pushed, add this input to `@actions/checkout`:
    ```yaml
    ref: ${{ github.ref }}
    ```
  * Automatically populated `GITHUB_TOKEN` variable cannot be used if branch protection is enabled for the target branch. In this case you need to create a personal access token with elevated permissions and should be aware of the security risks of using it.
* To trigger Octorelease on demand, you can use the [`workflow_dispatch`](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow) event to trigger releases manually with a button click, or the [`repository_dispatch`](https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event) event to trigger releases using a REST API call.

### Jenkins

The following is a minimal configuration for Octorelease with a declarative pipeline running Node.

```groovy
pipeline {
    agent any  // Use agent with Node.js preinstalled

    environment {
        GITHUB_TOKEN = credentials('GITHUB_TOKEN')
        NPM_TOKEN = credentials('NPM_TOKEN')
    }

    stages {
        stage("Install Dependencies") {
            steps {
                sh "npm ci"
            }
        }

        stage("Publish Release") {
            steps {
                sh "npx octorelease"
            }
        }
    }
}
```

Notes:
* For Octorelease to read Git history, make sure "shallow clone" is disabled in the Git settings for your pipeline.
