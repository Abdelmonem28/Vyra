/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import Component from '../src/Core/component';
import Router from '../src/Core/router';
import { createState } from '../src/Core/state';

describe('Component', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="Zweb-App"></div>';
        document.title = 'Nebula';
        Router.routes = [];
        Component.loading = null;
        vi.restoreAllMocks();
    });

    it('compiles using instance data over passed context', () => {
        const component = new Component('<p>{{name}}</p>', undefined, { name: 'Ada' });

        expect(component.compile({ name: 'Bob' })).toBe('<p>Ada</p>');
    });

    it('renders to string for nested component composition', () => {
        const component = new Component('<p>{{name}}</p>');

        expect(component.renderToString({ name: 'Ada' })).toBe('<p>Ada</p>');
    });

    it('renders into the root element and updates the document title', async () => {
        const component = new Component('<main>Hello</main>', 'Dashboard');

        await component.view();

        const root = document.getElementById('Zweb-App');
        const rendered = root?.firstElementChild as HTMLElement;

        expect(rendered.tagName).toBe('MAIN');
        expect(rendered.textContent).toBe('Hello');
        expect(rendered.className).toMatch(/^Template-/);
        expect(document.title).toBe('Dashboard');
    });

    it('throws when the root element is missing', async () => {
        document.body.innerHTML = '';
        const component = new Component('<main>Hello</main>');

        await expect(component.view()).rejects.toThrow('there is no root id: Zweb-App');
    });

    it('binds interactions to rendered elements', async () => {
        const handler = vi.fn();
        const component = new Component('<button id="cta">Click</button>');

        component.setInteraction('cta', 'click', handler);

        await component.view();

        document.getElementById('cta')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('injects scoped inline styles', async () => {
        const component = new Component('<main>Styled</main>');

        component.setStyle('color: red;');

        await component.view();

        const rendered = document.getElementById('Zweb-App')?.firstElementChild as HTMLElement;
        const style = rendered.querySelector('style');

        expect(style?.textContent).toBe(`.${rendered.classList[0]} {color: red;}`);
    });

    it('loads external stylesheets and scopes them to the view', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            text: vi.fn().mockResolvedValue('background: black;'),
        } as any);
        const component = new Component('<main>Styled</main>');

        component.setStyleSheet('/styles.css');

        await component.view();

        const rendered = document.getElementById('Zweb-App')?.firstElementChild as HTMLElement;
        const style = rendered.querySelector('style');

        expect(fetchSpy).toHaveBeenCalledWith('/styles.css');
        expect(style?.textContent).toBe(`.${rendered.classList[0]} {background: black;}`);
    });

    it('re-renders when a bound state changes', async () => {
        const component = new Component('<main>{{count}}</main>');
        const [count, setCount] = createState(0);

        component.bindState('count', count);

        await component.view();

        expect(document.getElementById('Zweb-App')?.textContent).toContain('0');

        setCount(prev => prev + 1);

        expect(document.getElementById('Zweb-App')?.textContent).toContain('1');
    });

    it('uses the instance loading view before navigation', async () => {
        history.pushState(null, '', '/current');

        const loading = new Component('<main>Loading</main>');
        const loadingSpy = vi.spyOn(loading, 'view').mockResolvedValue(undefined as any);
        const navigateSpy = vi.spyOn(Router, 'navigateTo').mockResolvedValue(undefined as any);
        const component = new Component('<main>Page</main>');
        const trigger = document.createElement('button');

        document.body.append(trigger);
        component.setLoading(loading);
        component.setTrigger(trigger, 'click', '/next');

        trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        await Promise.resolve();
        await Promise.resolve();

        expect(loadingSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledWith('/next');
    });

    it('uses the global loading view when there is no instance loading view', async () => {
        history.pushState(null, '', '/current');

        const loading = new Component('<main>Loading</main>');
        const loadingSpy = vi.spyOn(loading, 'view').mockResolvedValue(undefined as any);
        const navigateSpy = vi.spyOn(Router, 'navigateTo').mockResolvedValue(undefined as any);
        const component = new Component('<main>Page</main>');
        const trigger = document.createElement('button');

        document.body.append(trigger);
        Component.setLoading(loading);
        component.setTrigger(trigger, 'click', '/next');

        trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        await Promise.resolve();
        await Promise.resolve();

        expect(loadingSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledWith('/next');
    });

    it('logs when the trigger is null', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const component = new Component('<main>Page</main>');

        component.setTrigger(null, 'click', '/next');

        expect(errorSpy).toHaveBeenCalledWith('the trigger is null');
        expect(Router.routes).toEqual([{ path: '/next', view: component }]);
    });
});
