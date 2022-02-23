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
        "@octorelease/git"
    ],
    tagPrefix: require(`./${process.env["INPUT_working-dir"]}/package.json`).name + "@"
};
