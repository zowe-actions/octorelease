import * as path from "path";
import * as esbuild from "esbuild";

const pkgName = path.basename(process.cwd());
await esbuild.build({
    alias: { "@octorelease/core": "../index" },
    bundle: true,
    entryPoints: [pkgName === "core" ? "src/main.ts" : "src/index.ts"],
    external: ["../index"],
    logLevel: "info",
    outfile: `../../dist/${pkgName === "core" ? "index" : pkgName}.js`,
    platform: "node"
});
