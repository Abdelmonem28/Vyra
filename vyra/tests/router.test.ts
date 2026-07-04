/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import Router from '../src/Core/router';
import Component from '../src/Core/component';

describe('Router', () => {
    beforeEach(() => {
        Router.routes = [];
        document.body.innerHTML = '<div id="Zweb-App"></div>';
        document.title = 'Nebula';
        history.pushState(null, '', '/');
        vi.restoreAllMocks();
    });

    it('starts with an empty route list', () => {
        Router.routes = [];

        expect(Router.routes).toEqual([]);
    });

    it('renders the matching route', async () => {
        const renderedTemplates: string[] = [];

        vi.spyOn(Component.prototype, 'view').mockImplementation(async function () {
            renderedTemplates.push((this as any).component);
        });

        Router.routes = [{ path: '/home', view: new Component('<main>Home</main>', 'Home') }];
        history.pushState(null, '', '/home');

        await Router.router();

        expect(renderedTemplates).toEqual(['<main>Home</main>']);
    });

    it('falls back to the 404 route when no path matches', async () => {
        const renderedTemplates: string[] = [];

        vi.spyOn(Component.prototype, 'view').mockImplementation(async function () {
            renderedTemplates.push((this as any).component);
        });

        history.pushState(null, '', '/missing');

        await Router.router();

        expect(renderedTemplates).toEqual(['<h1>OOPS - NOT FOUND 404</h1>']);
    });

    it('pushes history and delegates to router during navigation', async () => {
        const routerSpy = vi.spyOn(Router, 'router').mockResolvedValue(undefined as any);
        const pushSpy = vi.spyOn(history, 'pushState');

        await Router.navigateTo('/next');

        expect(pushSpy).toHaveBeenCalledWith(null, '', '/next');
        expect(routerSpy).toHaveBeenCalledTimes(1);
    });

    it('logs navigation failures without throwing', async () => {
        const error = new Error('boom');
        const routerSpy = vi.spyOn(Router, 'router').mockRejectedValue(error);
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        await expect(Router.navigateTo('/next')).resolves.toBeUndefined();

        expect(routerSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith(error);
    });
});
