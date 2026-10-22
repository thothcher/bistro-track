import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // "@/lib/utils" means "src/lib/utils": no more ../../../ in imports
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
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
});
