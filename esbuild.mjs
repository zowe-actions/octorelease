import * as fs from "fs";
import * as esbuild from "esbuild";

fs.rmSync("dist", { recursive: true, force: true });
const entryPoints = {
    index: "packages/core/src/main.ts"
};
fs.readdirSync("packages").forEach((name) => {
    if (name !== "core") {
        entryPoints[name] = `packages/${name}/src/index.ts`;
    }
});
await esbuild.build({
    banner: {
        js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`
    },
    bundle: true,
    entryPoints,
    format: "esm",
    logLevel: "info",
    outdir: "dist",
    outExtension: {
        ".js": ".mjs"
    },
    platform: "node",
    splitting: true
});
