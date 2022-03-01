# Usage

## Getting started

In order to use Octorelease you must follow these steps:

1. [Install](#installation) Octorelease in your project
2. Configure your Continuous Integration service to [run Octorelease](#ci-configuration)
3. Configure your Git repository and package manager repository authentication in your Continuous Integration service
4. Configure Octorelease [options and plugins](#configuration)

## Installation

For [Node modules projects](https://docs.npmjs.com/getting-started/creating-node-modules) it is recommended to install Octorelease locally:

```bash
$ npm install --save-dev @octorelease/core
```

For other types of projects you can skip this step since `npx` will install Octorelease directly in the CI environment.

In your CI environment, run the `octorelease` command with [`npx`](https://www.npmjs.com/package/npx):

```bash
$ npx octorelease
```

**Note:** For projects that use GitHub workflows, you don't need to install Octorelease or run it with `npx`. It can be invoked as an action in your workflow instead:

```yaml
- uses: octorelease/octorelease@master
```

## CI Configuration

The `octorelease` command must be executed only after all the tests in the CI build pass. If the build runs multiple jobs (for example to test on multiple Operating Systems or Node versions) the CI has to be configured to guarantee that the `octorelease` command is executed only after all jobs are successful. Here are a few examples of the CI services that can be used to achieve this:

- [GitHub Actions](https://github.com/features/actions)
- [Jenkins Pipelines](https://www.jenkins.io/doc/book/pipeline/)

See [CI configuration recipes](recipes.md) for more details.

Octorelease requires authentication to perform actions like pushing to the project Git repository and publishing to a package manager registry. Authentication tokens or credentials have to be made available in the CI service via environment variables. See each plugin's documentation for the environment variables required.

## Configuration

TODO

## Plugins

TODO

## Workflow configuration

TODO

<!-- ## Shareable configurations -->
