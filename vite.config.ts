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
      entry: {
        formuler: resolve(__dirname, "lib/formuler.ts"),
        "simple_form/index": resolve(__dirname, "lib/simple_form/index.ts"),
      },
      name: "Formuler",
      formats: ["cjs", "es"],
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
