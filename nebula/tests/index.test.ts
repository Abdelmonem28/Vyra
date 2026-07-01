/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('app entrypoint', () => {
    beforeEach(() => {
        vi.resetModules();
        document.body.innerHTML = '';
    });

    it('wires DOMContentLoaded and popstate to router.router', async () => {
        const router = vi.fn().mockResolvedValue(undefined);

        vi.doMock('../src/Core/router', () => ({
            default: {
                router,
            },
        }));

        await import('../src/index');

        document.dispatchEvent(new Event('DOMContentLoaded'));
        window.dispatchEvent(new PopStateEvent('popstate'));

        await Promise.resolve();
        await Promise.resolve();

        expect(router).toHaveBeenCalledTimes(2);
    });
});