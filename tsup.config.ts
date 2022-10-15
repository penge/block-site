import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entry: [
    "src/background.ts",
    "src/blocked.ts",
    "src/options.ts",
  ],
  target: "es2022",
});
