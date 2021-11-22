const fs = require("fs");
const path = require("path");
const glob = require("glob");
const ncc = require("@vercel/ncc");

(async () => {
    for (const pkgDir of glob.sync(__dirname + "/../packages/!(core)/")) {
        ncc(path.join(pkgDir, "lib", "index.js")).then(({ code }) => {
            fs.writeFileSync(path.join(__dirname, "..", "dist", path.basename(pkgDir) + ".js"), code);
        });
    }
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
