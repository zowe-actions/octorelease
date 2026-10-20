# Maintainer guide

[Setup and checks](../CONTRIBUTING.md) · [Design principles](developer-guide.md#design-principles) · [Release examples](release-examples.md)

Most changes are tested and delivered through the GitHub Action. Start with tests and a rebuilt bundle, then verify the action in CI.

## Your first change

This exercise adds the command name to the Exec plugin's completion message. It covers a small change from source to test to bundle.

### 1. Find the code

Complete the [repository setup](../CONTRIBUTING.md#set-up-the-repository), then open:

- [`packages/exec/src/utils.ts`](../packages/exec/src/utils.ts): runs commands and logs their exit codes.
- [`packages/exec/src/index.ts`](../packages/exec/src/index.ts): exports the plugin handlers.
- [`packages/exec/__tests__`](../packages/exec/__tests__): plugin tests.

The message is `Process finished with exit code 0`. For this exercise, make it `Command "node --version" finished with exit code 0` when that command runs.

### 2. Describe the result in a test

Create `packages/exec/__tests__/utils.test.ts`:

```ts
import * as exec from "@actions/exec";
import type { IContext } from "@octorelease/core";
import { runCmd } from "../src/utils";

vi.mock("@actions/exec");

it("identifies the completed command", async () => {
    vi.mocked(exec.exec).mockResolvedValueOnce(0);
    const logger = { debug: vi.fn() };
    const context = { dryRun: false, logger } as unknown as IContext;

    await runCmd(context, "node --version");

    expect(exec.exec).toHaveBeenCalledWith("node --version");
    expect(logger.debug).toHaveBeenCalledWith(
        'Command "node --version" finished with exit code 0',
    );
});
```

Run it from the repository root:

```sh
npm test -- packages/exec/__tests__/utils.test.ts
```

The assertion should fail on the original message. The command runner is mocked; the test does not launch a process.

### 3. Make the change

Update the debug message in `runCmd`:

```ts
context.logger.debug(`Command "${command}" finished with exit code ${exitCode}`);
```

Rerun the focused test, then check the package and repository:

```sh
npm run all
```

- The focused test should pass.
- `npm run all` builds, formats, bundles, and runs tests.

### 4. Check the bundle

Run the bundled `init` handler with a harmless local command:

```sh
node <<'JS'
const { init } = require("./dist/exec");
init({ dryRun: false, logger: console }, { initCmd: "node --version" })
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
JS
```

Expect the Node.js version followed by a completion message naming `node --version`.

- If the old message appears, rebuild with `npm run pack`.
- This checks the bundled plugin handler. It does not test CI detection, credentials, or publishing.
- For an action-level check, use a disposable CI checkout and `uses: ./`; see the [test workflow](../.github/workflows/test.yml).
- To test in a consumer repository before releasing, use `zowe-actions/octorelease@<commit-sha>` with a commit containing the rebuilt bundle.

### 5. Prepare the PR

- Add the change to `packages/exec/CHANGELOG.md` under `## Recent Changes`.
- Review source, test, and `dist/exec.js` changes.
- Update API comments or usage docs if behavior or options changed.
- Run `npm run typedoc` when core APIs or their comments change.
- Describe the result and validation in the PR. Follow the [PR checklist](../CONTRIBUTING.md#submitting-a-pull-request).

## Decide what to release

Create an action release when changes are ready for consumers:

| Change | Release target |
| --- | --- |
| Documentation only | No action release is needed. |
| Core, plugins, companion script action, or action metadata | Release the action with the updated bundle and metadata. |
| Repository CI or development tooling | Release only if the change affects the distributed action. |

For the Exec exercise, verify the updated action in CI, then tag an action release.

### Choose versions and dependencies

- **Patch:** compatible bug fixes.
- **Minor:** compatible features or options.
- **Major:** changes that require consumers to adapt.
- Review callers before changing exported types, handler behavior, or defaults.
- If a package starts using a new API from another package, raise its dependency minimum to the version that provides that API.
- Keep related package changes together.
- Review compatibility across the bundled plugins. A breaking plugin change can require a new action major version.

## Release the GitHub Action

1. Merge the code and generated bundles. Confirm CI passed for the release commit.
2. Open **Releases → Draft a new release**.
3. Create an unused version tag, such as `v1.2.3`, targeting that commit.
4. Select the previous action tag and **Generate release notes**.
5. Review the notes, add upgrade instructions, and publish.
6. Check the [Update latest tag workflow](../.github/workflows/update-tag.yml). Verify the major alias, such as `v1`, points to the release commit.
7. Test the exact version tag in a consumer workflow.

The tag must contain the rebuilt `dist/` files. See [GitHub's release-note instructions](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes) for the release form.

## Package prereleases

Pushes to `master` automatically publish workspace package prereleases to Zowe Artifactory under `next`. Versions combine a base version from a Git tag with a UTC timestamp. These packages are available for CLI testing; they are not required for testing the GitHub Action.

See the [Release workflow](../.github/workflows/release.yml), [CLI installation instructions](../packages/core/README.md#install), or [prerelease troubleshooting](support.md#octorelease-prerelease-publication-failed) when needed.
