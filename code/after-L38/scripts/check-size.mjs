// A budget for the first load. Run it after "npm run build": it adds up the JavaScript a guest must
// download before the first page can show (the files that dist/index.html asks for up front),
// gzips each file like the build report does, and fails when the total is over the budget.
// A pull request that makes the site heavier turns red, like a pull request that breaks a test.
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const BUDGET_KB = 170; // gzip, kilobytes (1 kB = 1000 bytes). The build we measured: about 160.

const html = readFileSync("dist/index.html", "utf8");
// <script type="module" src="/assets/index-….js"> and <link rel="modulepreload" href="/assets/react-vendor-….js">
const files = [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+\.js)"/g)].map(
  (m) => m[1],
);

let total = 0;
for (const file of files) {
  const size = gzipSync(readFileSync(`dist/${file}`)).length;
  total += size;
  console.log(`${(size / 1000).toFixed(1).padStart(7)} kB  ${file}`);
}

const kb = total / 1000;
console.log(
  `${kb.toFixed(1).padStart(7)} kB  first-load JavaScript (budget ${BUDGET_KB} kB)`,
);

if (kb > BUDGET_KB) {
  console.error(
    `Over budget by ${(kb - BUDGET_KB).toFixed(1)} kB. Find what grew (a new library? a page that is no longer lazy?),` +
      " or, if the growth is worth it, raise BUDGET_KB in this file in the same pull request, and say why.",
  );
  process.exit(1);
}
