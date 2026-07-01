import { Token } from '../types';

export function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let startSlice = 0;
    const regx = /{{(.*?)}}/g;
    let match: RegExpExecArray | null;
    match = regx.exec(input);
    while (match !== null) {
        if (match.index > startSlice) tokens.push({ type: 'text', value: input.slice(startSlice, match.index) });
        const raw = match[1].trim();
        if (raw.startsWith('#if')) tokens.push({ type: 'if', condition: raw.slice(3).trim() });
        else if (raw === 'else') tokens.push({ type: 'else' });
        else if (raw === '/if') tokens.push({ type: 'endif' });
        else if (raw.startsWith('#each')) tokens.push({ type: 'each', source: raw.slice(5).trim() });
        else if (raw === '/each') tokens.push({ type: 'endeach' });
        else if (raw.startsWith('>')) tokens.push({ type: 'component', name: raw.slice(1).trim() });
        else tokens.push({ type: 'interp', expr: raw });
        startSlice = regx.lastIndex;
        match = regx.exec(input);
    }
    if (startSlice < input.length) tokens.push({ type: 'text', value: input.slice(startSlice) });
    return tokens;
}