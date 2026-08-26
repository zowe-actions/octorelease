// Some @actions/* packages only define an "import" condition in their
// package.json "exports" map, which breaks `require("@actions/...")` from
// this project's CommonJS code. This patches node_modules in place to add a
// matching "require" condition alongside each "import" condition.
const fs = require("fs");
const path = require("path");

const actionsDir = path.join(__dirname, "node_modules", "@actions");
let numChanged = 0;

for (const packageName of fs.readdirSync(actionsDir)) {
    const packageJsonPath = path.join(actionsDir, packageName, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const exportsMap = packageJson.exports;

    let changed = false;
    for (const conditions of Object.values(exportsMap)) {
        if (conditions != null && typeof conditions === "object" && "import" in conditions) {
            conditions.require = conditions.import;
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
        numChanged++;
    }
}

if (numChanged) {
    console.log(`Patched ${numChanged} '@actions/*' packages to support CJS`);
}
