import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    resolve: {
        alias: {
            '@nebula/component': fileURLToPath(new URL('../../src/Core/component.ts', import.meta.url)),
            '@nebula/state': fileURLToPath(new URL('../../src/Core/state.ts', import.meta.url)),
        },
    },
    server: {
        fs: {
            allow: [fileURLToPath(new URL('../..', import.meta.url))],
        },
    },
});