import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/  ·  https://vitest.dev/config/
// Vitest reads this very file, so the tests see the same plugins and the same "@" alias as the app.
export default defineConfig({
  plugins: [
    react(),
    // The React Compiler (L38): it writes the memoization we used to write by hand (memo, useMemo,
    // useCallback). The tests run the compiled code too, because that is the code the guests get.
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    // "@/lib/utils" means "src/lib/utils": no more ../../../ in imports
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    rolldownOptions: {
      output: {
        // React is big and changes twice a year; our code changes every day. In a file of its own,
        // a deploy of our code does not make every guest download React again.
        codeSplitting: {
          groups: [
            { name: "react-vendor", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
          ],
        },
      },
    },
  },
  server: {
    // The app asks for /api/... on its own address. Vite forwards those requests to the real API,
    // so the browser never makes a cross-origin request and CORS never blocks it.
    proxy: {
      "/api": {
        target: "https://srmsapi.stepacademy.ge",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  test: {
    // jsdom is a pretend browser inside Node: a document, a window, events, localStorage
    environment: "jsdom",
    // the first test of a file pays for loading the app's code: on a slow machine 5 seconds is not always enough
    testTimeout: 15_000,
    // runs before every test file: matchers, the fake API, cleanup
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reportOnFailure: true, // keep the report when a test fails: that is when you want to read it
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/test/**", "src/**/*.test.{ts,tsx}", "src/main.tsx", "src/components/ui/**"],
    },
  },
});
