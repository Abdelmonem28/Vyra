import { describe, it, expect, vi } from 'vitest';
import { render } from '../../src/Compiler/render';
import type { Node } from '../../src/types';

describe('render', () => {
    it('renders plain text and interpolations', () => {
        const ast: Node[] = [
            { type: 'text', value: 'Hello ' },
            { type: 'interp', expr: 'user.name' },
            { type: 'text', value: '!' },
        ];

        expect(render(ast, { user: { name: 'Ada' } })).toBe('Hello Ada!');
    });

    it('renders if and else branches from truthy and falsey values', () => {
        const ast: Node[] = [
            {
                type: 'if',
                condition: 'isReady',
                then: [{ type: 'text', value: 'ready' }],
                else: [{ type: 'text', value: 'not ready' }],
            },
        ];

        expect(render(ast, { isReady: true })).toBe('ready');
        expect(render(ast, { isReady: false })).toBe('not ready');
    });

    it('renders function-based if conditions with resolved parameters', () => {
        const predicate = vi.fn((user: { active: boolean }) => user.active);
        const ast: Node[] = [
            {
                type: 'if',
                condition: '(isActive currentUser)',
                then: [{ type: 'text', value: 'yes' }],
                else: [{ type: 'text', value: 'no' }],
            },
        ];

        expect(render(ast, {
            isActive: predicate,
            currentUser: { active: true },
        })).toBe('yes');
        expect(predicate).toHaveBeenCalledWith({ active: true });
    });

    it('renders each blocks using the current item scope', () => {
        const ast: Node[] = [
            {
                type: 'each',
                source: 'items',
                children: [
                    { type: 'interp', expr: 'this.name' },
                    {
                        type: 'if',
                        condition: 'this.showSuffix',
                        then: [{ type: 'text', value: '!' }],
                        else: [],
                    },
                ],
            },
        ];

        expect(render(ast, {
            items: [{ name: 'A', showSuffix: true }, { name: 'B', showSuffix: false }],
        })).toBe('A!B');
    });

    it('renders component includes through data.children', () => {
        const child = {
            renderToString: vi.fn((scope: Record<string, any>) => `<nav>${scope.title}</nav>`),
        };
        const ast: Node[] = [
            { type: 'text', value: '<div>' },
            { type: 'component', name: 'navbar' },
            { type: 'text', value: '</div>' },
        ];

        expect(render(ast, {
            title: 'Home',
            children: { navbar: child },
        })).toBe('<div><nav>Home</nav></div>');
        expect(child.renderToString).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Home',
            children: expect.any(Object),
        }));
    });

    it('throws when a component include is missing', () => {
        const ast: Node[] = [{ type: 'component', name: 'navbar' }];

        expect(() => render(ast, {})).toThrow('Component "navbar" was not found in data.children');
    });

    it('skips each blocks when the source is not an array', () => {
        const ast: Node[] = [
            { type: 'text', value: '[' },
            {
                type: 'each',
                source: 'items',
                children: [{ type: 'interp', expr: 'this.name' }],
            },
            { type: 'text', value: ']' },
        ];

        expect(render(ast, { items: null })).toBe('[]');
    });
});
