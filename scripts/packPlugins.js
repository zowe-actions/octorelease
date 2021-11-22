const fs = require("fs");
const os = require("os");
const path = require("path");
const glob = require("glob");
const ncc = require("@vercel/ncc");

(async () => {
    const data = fs.readFileSync(path.join(__dirname, "..", "dist", "index.js"), "utf-8");
    fs.writeFileSync(path.join(__dirname, "..", "dist", "index.js"), data.replace("node\r", "node" + os.EOL));

    for (const pkgDir of glob.sync(__dirname + "/../packages/!(core)/")) {
        ncc(path.join(pkgDir, "lib", "index.js")).then(({ code }) => {
            fs.writeFileSync(path.join(__dirname, "..", "dist", path.basename(pkgDir) + ".js"), code);
        });
    }
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
