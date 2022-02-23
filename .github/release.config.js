module.exports = {
    branches: [
        {
            name: "test-timothy",
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
        "@octorelease/git"
    ],
    tagPrefix: "@octorelease/" + require("path").basename(process.env["INPUT_WORKING-DIR"]) + "@"
};
