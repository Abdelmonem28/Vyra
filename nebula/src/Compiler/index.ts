import { tokenize } from './tokenizer';
import { parse } from './parser';
import { render } from './render';

export default function JSCompiler(component: string, data: { [key: string]: any }, ): string {
    const tokens = tokenize(component);
    const ast = parse(tokens);
    return render(ast, data);
}