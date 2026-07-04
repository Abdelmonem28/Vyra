import Component from "./Core/component";

export type Token =
    | { type: 'text', value: string }
    | { type: 'interp', expr: string }
    | { type: 'if', condition: string }
    | { type: 'else' }
    | { type: 'endif' }
    | { type: 'each', source: string }
    | { type: 'endeach' }
    | { type: 'component', name: string };

export type Node =
    | { type: 'text', value: string }
    | { type: 'interp', expr: string }
    | { type: 'if', condition: string, then: Node[], else: Node[] }
    | { type: 'each', source: string, children: Node[] }
    | { type: 'component', name: string };

// Describes a DOM interaction to attach after rendering.
export type interaction = {
    id: string,
    event: string,
    handler: (event: Event) => void
}

// Optional configuration used by each View instance.
export type data = {
    styles?: string,
    stylesPath?: string,
    interactions?: interaction[],
    children?: { [key: string]: Component },
}

export type subscription = () => void;

export type StateGetter<T> = (() => T) & {
    _subscribe: (fn: subscription) => void;
    _unsubscribe: (fn: subscription) => void;
};