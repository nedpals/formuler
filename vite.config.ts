import { defineConfig } from "vite";
import { resolve } from "path";

import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ tsconfigPath: resolve(__dirname, "tsconfig.build.json") }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/formuler.ts"),
      name: "Formuler",
      formats: ["umd", "es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
  },
});
