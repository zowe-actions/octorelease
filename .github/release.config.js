const package = require("path").basename(process.env["INPUT_WORKING-DIR"]);
module.exports = {
    branches: [
        {
            name: "master",
            level: "minor"
        },
        {
            name: "next",
            prerelease: true
        }
    ],
    plugins: [
        "@octorelease/changelog",
        ["@octorelease/npm", {
            smokeTest: true,
            tarballDir: "dist"
        }],
        ["@octorelease/github", {
            assets: "dist/*.tgz"
        }],
        ["@octorelease/git", {
            commitMessage: "Bump " + package + " version to {{version}}"
        }]
    ],
    tagPrefix: package + "-"
};
