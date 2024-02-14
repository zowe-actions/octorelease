import * as path from "path";
import * as esbuild from "esbuild";

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
    outfile: `../../dist/${pkgName === "main" ? "index" : pkgName}.js`,
    platform: "node",
    plugins: [onResolvePlugin]
});
