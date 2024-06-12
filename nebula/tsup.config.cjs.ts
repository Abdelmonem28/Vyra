import { defineConfig } from 'tsup';

export default defineConfig({
    format: ['cjs'],
    entryPoints: ['src/index.ts','src/bin/nebula.ts','src/cli', 'src/server'],
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
    outDir: 'dist',
    minify: true,
});