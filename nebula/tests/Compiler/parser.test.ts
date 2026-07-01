import { describe, it, expect } from 'vitest';
import { parse } from '../../src/Compiler/parser';
import type { Token, Node } from '../../src/types';

describe('parse', () => {
	it('parses a flat token sequence', () => {
		const tokens: Token[] = [
			{ type: 'text', value: 'Hello ' },
			{ type: 'interp', expr: 'name' },
			{ type: 'text', value: '!' },
		];

		expect(parse(tokens)).toEqual([
			{ type: 'text', value: 'Hello ' },
			{ type: 'interp', expr: 'name' },
			{ type: 'text', value: '!' },
		]);
	});

	it('parses a single if block', () => {
		const tokens: Token[] = [
			{ type: 'if', condition: 'isReady' },
			{ type: 'text', value: 'ready' },
			{ type: 'endif' },
		];

		expect(parse(tokens)).toEqual([
			{
				type: 'if',
				condition: 'isReady',
				then: [{ type: 'text', value: 'ready' }],
				else: [],
			},
		]);
	});

	it('parses if/else blocks', () => {
		const tokens: Token[] = [
			{ type: 'if', condition: 'isReady' },
			{ type: 'text', value: 'yes' },
			{ type: 'else' },
			{ type: 'text', value: 'no' },
			{ type: 'endif' },
		];

		expect(parse(tokens)).toEqual([
			{
				type: 'if',
				condition: 'isReady',
				then: [{ type: 'text', value: 'yes' }],
				else: [{ type: 'text', value: 'no' }],
			},
		]);
	});

	it('parses each blocks containing an if block', () => {
		const tokens: Token[] = [
			{ type: 'each', source: 'items' },
			{ type: 'if', condition: 'showLabel' },
			{ type: 'interp', expr: 'this.label' },
			{ type: 'endif' },
			{ type: 'endeach' },
		];

		expect(parse(tokens)).toEqual([
			{
				type: 'each',
				source: 'items',
				children: [
					{
						type: 'if',
						condition: 'showLabel',
						then: [{ type: 'interp', expr: 'this.label' }],
						else: [],
					},
				],
			},
		]);
	});

	it('parses if blocks containing an each block', () => {
		const tokens: Token[] = [
			{ type: 'if', condition: 'hasItems' },
			{ type: 'each', source: 'items' },
			{ type: 'interp', expr: 'this.name' },
			{ type: 'endeach' },
			{ type: 'endif' },
		];

		expect(parse(tokens)).toEqual([
			{
				type: 'if',
				condition: 'hasItems',
				then: [
					{
						type: 'each',
						source: 'items',
						children: [{ type: 'interp', expr: 'this.name' }],
					},
				],
				else: [],
			},
		]);
	});

	it('throws when a block is not closed', () => {
		const tokens: Token[] = [
			{ type: 'if', condition: 'isReady' },
			{ type: 'text', value: 'ready' },
		];

		expect(() => parse(tokens)).toThrow('unclosed blocks in template');
	});
});
