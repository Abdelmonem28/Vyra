import { describe, expect, it } from 'vitest';
import JSCompiler from '../../src/Compiler';

describe('JSCompiler', () => {
    it('compiles a mixed template end to end', () => {
        const html = JSCompiler(
            '<section>{{#if ok}}<span>{{name}}</span>{{else}}<em>no</em>{{/if}}</section>',
            { ok: true, name: 'Ada' }
        );

        expect(html).toBe('<section><span>Ada</span></section>');
    });

    it('compiles nested components through children', () => {
        const html = JSCompiler('<div>{{> navbar}}</div>', {
            title: 'Home',
            children: {
                navbar: {
                    renderToString: ({ title }: { title: string }) => `<nav>${title}</nav>`,
                },
            },
        });

        expect(html).toBe('<div><nav>Home</nav></div>');
    });

    it('renders missing nested key as empty string, not the key name', () => {
        expect(JSCompiler('{{user.city}}', { user: { name: 'Karf' } })).toBe('');
    });

    it('renders falsy zero at a nested path correctly', () => {
        expect(JSCompiler('{{score.value}}', { score: { value: 0 } })).toBe('0');
    });

    it('returns an empty string for an empty template', () => {
        expect(JSCompiler('', {})).toBe('');
    });

    it('throws malformed template errors from the parser', () => {
        expect(() => JSCompiler('{{#if ok}}<p>x</p>', { ok: true })).toThrow('unclosed blocks in template');
    });
});