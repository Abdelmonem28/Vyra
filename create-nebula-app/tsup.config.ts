import { defineConfig } from 'tsup';

export default defineConfig({
    format: ['cjs'],
    entryPoints: ['./src/index.ts'],
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
    outDir: 'dist',
    // minify: true,
});