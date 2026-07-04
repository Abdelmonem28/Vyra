import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm"],
  entryPoints: ["src/index.ts"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
  outDir: "dist/module",
  minify: true,
});