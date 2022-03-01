# Developer guide

## JavaScript API

Typedoc for the APIs exported by the @octorelease/core package can be found [here](https://github.com/octorelease/octorelease/tree/master/docs).

Many Octorelease plugins also export utility methods which can easily be used to create your own scripts. For example, to publish a package to npmjs.org using the [@octorelease/npm](https://github.com/octorelease/octorelease/tree/master/packages/npm) plugin:

```javascript
const { utils } = require("@octorelease/npm");

const context = {
    dryRun: false,  // Specify true to skip actual publish operation
    env: process.env,  // NPM_TOKEN environment variable must be defined
    logger: console
};
const registry = "https://registry.npmjs.org";

(async () => {
    await utils.npmConfig(context, registry);
    await utils.npmPublish(context, "latest", registry);
})();
```

## Plugins

To create a plugin for Octorelease, you need to decide which steps are important to your plugin. For example, it is best to always have an `init` step because you may be receiving inputs from a user and want to make sure they exist. A plugin can handle any of the following steps (listed in the order that they execute):

* `init`
* `version`
* `publish`
* `success`
* `fail`

Octorelease will require the plugin via Node and look through the required object for methods named like the steps listed above. For example, if your plugin only had an `init` and `success` step, the `main` file for your object would need to `export` an object with `init` and `success` functions.

Each step handler method is passed two objects:

1. `context` - an object containing the
2. `config` - an object containing the options that a user may pass in via their `release.config.js` file (or similar)

For each step that you handle, you will want to ensure it can accept `context` and `config` as parameters.

To create a plugin project, it is recommended to fork the template repository [octorelease/sample-plugin](https://github.com/octorelease/sample-plugin). Alternatively, if you want to start a project from scratch:

1. Generate a new project with `npm init`. This will provide you with a basic Node project to get started with.
2. Create an `index.js` file, and make sure it is specified as the `main` in the `package.json`. You will use this file to `export` an object defining your steps as described above.
3. Create a `src` or `lib` folder in the root of the project. This is where you will store your logic and code for how the step handler methods work. Also create a `test` folder so you can write tests related to your logic.
4. (recommended) Set up a linting system to ensure good JavaScript practices are enforced. ESLint is usually the system of choice, and the configuration can be whatever you prefer.

<!-- ## Shareable configuration -->
