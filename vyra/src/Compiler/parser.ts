import { Token, Node } from '../types';

export function parse(tokens: Token[]): Node[] {
    const out: Node[] = [];
    const stack: { type: 'if' | 'each', node: any }[] = [];

    let pushNode = function (n: Node) {
        if (stack.length === 0) out.push(n);
        else stack[stack.length - 1].node.children
            ? stack[stack.length - 1].node.children.push(n)
            : stack[stack.length - 1].node.then.push(n);
    };

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.type === 'text') pushNode({ type: 'text', value: token.value });
        else if (token.type === 'interp') pushNode({ type: 'interp', expr: token.expr });
        else if (token.type === 'component') pushNode({ type: 'component', name: token.name });
        else if (token.type === 'if') {
            const node: Node = { type: 'if', condition: token.condition, then: [], else: [] };
            pushNode(node);
            stack.push({ type: 'if', node });
        } else if (token.type === 'else') {
            const top = stack[stack.length - 1];
            if (!top || top.type !== 'if') throw new Error('unexpected else');
            // switch to else branch by marking a flag on node
            // we will treat subsequent pushes to go to else
            // implement by temporarily replacing push behavior
            (top.node as any)._inElse = true;
        } else if (token.type === 'endif') {
            const top = stack.pop();
            if (!top || top.type !== 'if') throw new Error('unexpected /if');
            delete (top.node as any)._inElse;
        } else if (token.type === 'each') {
            const node: Node = { type: 'each', source: token.source, children: [] };
            pushNode(node);
            stack.push({ type: 'each', node });
        } else if (token.type === 'endeach') {
            const top = stack.pop();
            if (!top || top.type !== 'each') throw new Error('unexpected /each');
        }

        // adjust push behavior for if-else: override last stack node branching
        if (stack.length > 0) {
            const top = stack[stack.length - 1];
            // monkey patch pushNode to respect else branch
            // Instead of replacing function, we will use flags when pushing above
            if (top.type === 'if') {
                // ensure node has _inElse flag default false
                (top.node as any)._inElse = (top.node as any)._inElse || false;
                // replace pushNode by local implementation using flag
                pushNode = function (n: Node) {
                    if ((top.node as any)._inElse) (top.node as any).else.push(n);
                    else (top.node as any).then.push(n);
                };
            } else {
                // restore generic pushNode
                pushNode = function (n: Node) {
                    if (stack.length === 0) out.push(n);
                    else stack[stack.length - 1].node.children
                        ? stack[stack.length - 1].node.children.push(n)
                        : stack[stack.length - 1].node.then.push(n);
                };
            }
        } else {
            // restore generic pushNode
            pushNode = function (n: Node) {
                if (stack.length === 0) out.push(n);
                else stack[stack.length - 1].node.children
                    ? stack[stack.length - 1].node.children.push(n)
                    : stack[stack.length - 1].node.then.push(n);
            };
        }
    }

    if (stack.length) throw new Error('unclosed blocks in template');
    return out;
}