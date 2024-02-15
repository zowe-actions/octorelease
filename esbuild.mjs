import * as path from "path";
import { fileURLToPath } from "url";
import * as esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgName = process.argv[2] || path.basename(process.cwd());
const onResolvePlugin = {
    name: "onResolve",
    setup(build) {
        if (pkgName === "main") {
            build.onResolve({ filter: /^.\/$/ }, () => {
                return { path: "./core", external: true };
            });
        } else {
            build.onResolve({ filter: /^@octorelease\/[^\/]+$/ }, (args) => {
                return { path: args.path.replace("@octorelease", "."), external: true };
            });
        }
    },
};

await esbuild.build({
    bundle: true,
    entryPoints: [pkgName === "main" ? "src/main.ts" : "src/index.ts"],
    logLevel: "info",
    outfile: `${__dirname}/dist/${pkgName === "main" ? "index" : pkgName}.js`,
    platform: "node",
    plugins: [onResolvePlugin]
});
