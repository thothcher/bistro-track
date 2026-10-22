import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The labs of the L38 deck: real React 19 (production build), bundled into one file the deck loads with a <script> tag.
// The React Compiler is NOT a plugin here: compile.mjs writes the compiled copies (src/gen) so that both versions of a component sit side by side.
export default defineConfig({
  plugins: [react()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    minify: true,
    // the scan counts renders by the NAME of a component: the minifier must not rename them
    rolldownOptions: { output: { keepNames: true } },
    lib: { entry: "src/main.tsx", name: "PerfLab", formats: ["iife"], fileName: () => "perf-lab.js" },
  },
});
