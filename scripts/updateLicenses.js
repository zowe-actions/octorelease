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

const fs = require("fs");
const picocolors = require("picocolors");

const filePaths = fs.globSync(
  "{**/*.js,**/*.mjs,**/*.ts}",
  {
    exclude: [
      "**/dist/**",
      "**/lib/**",
      "**/node_modules/**",
    ],
  }
);
// turn the license file into a multi line comment
const header =
  fs.readFileSync("LICENSE_HEADER", "utf-8") +
  require("os").EOL +
  require("os").EOL;
let alreadyContainedCopyright = 0;

for (const filePath of filePaths) {
  const file = fs.readFileSync(filePath);
  let result = file.toString();
  const resultLines = result.split(/\r?\n/g);
  if (resultLines.join().indexOf(header.split(/\r?\n/g).join()) >= 0) {
    alreadyContainedCopyright++;
    continue; // already has copyright
  }
  let usedShebang = "";
  const shebangPattern = /^#!(.*)/;
  result = result.replace(shebangPattern, (fullMatch) => {
    usedShebang = fullMatch + "\n"; // save the shebang that was used, if any
    return "";
  });
  // remove any existing copyright
  // Be very, very careful messing with this regex. Regex is wonderful.
  result = result.replace(
    /\/\*[\s\S]*?(License|SPDX)[\s\S]*?\*\/[\s\n]*/i,
    ""
  );
  result = header + result; // add the new header
  result = usedShebang + result; // add the shebang back
  fs.writeFileSync(filePath, result);
}
console.log(
  picocolors.blue(
    "Ensured that %d files had license information" + " (%d already did)."
  ),
  filePaths.length,
  alreadyContainedCopyright
);
