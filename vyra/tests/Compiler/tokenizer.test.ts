import { describe, it, expect } from 'vitest';
import { tokenize } from '../../src/Compiler/tokenizer';

describe('tokenize', () => {
    it('tokenizes plain text with no tags', () => {
        expect(tokenize('hello world')).toEqual([
            { type: 'text', value: 'hello world' },
        ]);
    });

    it('tokenizes a single interpolation', () => {
        expect(tokenize('Hello {{name}}!')).toEqual([
            { type: 'text', value: 'Hello ' },
            { type: 'interp', expr: 'name' },
            { type: 'text', value: '!' },
        ]);
    });

    it('tokenizes if/else/endif blocks', () => {
        expect(tokenize('{{#if isReady}}yes{{else}}no{{/if}}')).toEqual([
            { type: 'if', condition: 'isReady' },
            { type: 'text', value: 'yes' },
            { type: 'else' },
            { type: 'text', value: 'no' },
            { type: 'endif' },
        ]);
    });

    it('tokenizes each/endeach blocks', () => {
        expect(tokenize('{{#each items}}{{this}}{{/each}}')).toEqual([
            { type: 'each', source: 'items' },
            { type: 'interp', expr: 'this' },
            { type: 'endeach' },
        ]);
    });

    it('tokenizes sibling if blocks with identical conditions', () => {
        expect(tokenize('{{#if ok}}A{{/if}}{{#if ok}}B{{/if}}')).toEqual([
            { type: 'if', condition: 'ok' },
            { type: 'text', value: 'A' },
            { type: 'endif' },
            { type: 'if', condition: 'ok' },
            { type: 'text', value: 'B' },
            { type: 'endif' },
        ]);
    });

    it('tokenizes adjacent tags with no text between them', () => {
        expect(tokenize('{{a}}{{b}}')).toEqual([
            { type: 'interp', expr: 'a' },
            { type: 'interp', expr: 'b' },
        ]);
    });
});
