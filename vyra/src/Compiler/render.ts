import { Node } from '../types';

export function render(ast: Node[], data: { [key: string]: any }): string {
    let res = '';
    for (const node of ast) {
        if (node.type === 'text') res += node.value;
        else if (node.type === 'interp') {
            const val = resolvePath(node.expr, data);
            res += val === undefined || val === null ? '' : String(val);
        }
        else if (node.type === 'component') {
            const child = (data as any).children?.[node.name];
            if (!child) throw new Error(`Component "${node.name}" was not found in data.children`);
            if (typeof child.renderToString !== 'function') throw new Error(`Component "${node.name}" cannot be rendered`);
            res += child.renderToString(data);
        }
        else if (node.type === 'if') {
            const cond = node.condition.trim();
            if (cond.startsWith('(') && cond.endsWith(')')) {
                const inner = cond.slice(1, -1).trim();
                const [fn, param] = inner.split(/\s+/).filter(Boolean);
                const ok = typeof (data as any)[fn] === 'function' ? (data as any)[fn]((data as any)[param] ?? param) : false;
                res += ok ? render(node.then, data) : render(node.else, data);
            } else {
                const key = cond.replace(/^#?if\s*/, '').trim();
                const val = resolvePath(key, data);
                res += val ? render(node.then, data) : render(node.else, data);
            }
        } else if (node.type === 'each') {
            const arr = resolvePath(node.source, data);
            if (!Array.isArray(arr)) continue;
            for (let i = 0; i < arr.length; i++) {
                const scope = Object.assign({}, data);
                scope[node.source] = arr;
                scope.this = arr[i];
                res += render(node.children, scope);
            }
        }
    }
    return res;
}

function resolvePath(expr: string, data: { [key: string]: any }) {
    const parts = expr.split('.').map(s => s.trim()).filter(Boolean);
    const first = parts[0];
    let val: any = first in data ? data[first] : undefined;
    for (let i = 1; i < parts.length; i++) val = val?.[parts[i]];
    return val;
}