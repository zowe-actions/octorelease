/**
 * Copyright 2020-202X Zowe Actions Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
