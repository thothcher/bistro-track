// What does the React Compiler do with each component of this project? Run: node scripts/compiler-report.mjs
// It runs the same compiler as the build over every file of src/ (the tests are left out) and prints,
// for each component or hook, "compiled" or "left alone", with the compiler's reason.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const babel = require("@babel/core");
const compiler = require("babel-plugin-react-compiler");

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) return sourceFiles(file);
    return /\.tsx?$/.test(name) && !/\.test\.|\.d\.ts$/.test(name) ? [file] : [];
  });
}

let compiled = 0;
const leftAlone = [];
for (const file of sourceFiles("src")) {
  if (file.includes(`${path.sep}test${path.sep}`)) continue;
  const events = [];
  babel.transformSync(readFileSync(file, "utf8"), {
    filename: file,
    babelrc: false,
    configFile: false,
    parserOpts: { plugins: ["typescript", "jsx"] },
    // panicThreshold "none": a function the compiler cannot handle is skipped, never an error
    plugins: [
      [
        compiler,
        {
          logger: { logEvent: (_file, event) => events.push(event) },
          panicThreshold: "none",
        },
      ],
    ],
  });
  for (const event of events) {
    if (event.kind === "CompileSuccess") compiled++;
    else if (event.kind === "CompileError" || event.kind === "PipelineError") {
      const reason = event.detail?.reason ?? event.detail?.options?.reason ?? "";
      leftAlone.push(
        `${file.replaceAll("\\", "/")}  line ${event.fnLoc?.start.line}  ${reason}`,
      );
    }
  }
}

console.log(`compiled: ${compiled}, left alone: ${leftAlone.length}`);
for (const line of leftAlone) console.log(`  left alone: ${line}`);
