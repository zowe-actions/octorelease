import * as fs from "fs";
import * as path from "path";
import * as esbuild from "esbuild";

const pkgName = path.basename(process.cwd());
const pkgResolves = fs.readdirSync("..")
    .reduce((acc, elem) => ({ ...acc, [`@octorelease/${elem}`]: "./" + (elem === "core" ? "index" : elem) }), {});
await esbuild.build({
    alias: pkgResolves,
    bundle: true,
    entryPoints: [pkgName === "core" ? "src/main.ts" : "src/index.ts"],
    external: Object.values(pkgResolves),
    logLevel: "info",
    outfile: `../../dist/${pkgName === "core" ? "index" : pkgName}.js`,
    platform: "node"
});
