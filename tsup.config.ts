import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entry: [
    "src/background.ts",
    "src/blocked.ts",
    "src/options.ts",
  ],
  target: "es2022",
  format: "esm",
  noExternal: ["dayjs"],
  esbuildOptions(options) {
    options.chunkNames = "chunks/[name]-[hash]";
  }
});
