import fs from 'fs';
import path from 'path';

export default function bundler(fileUrl: string) {
    let bundle = '';
    let fileContent = fs.readFileSync(fileUrl,  'utf8');
    const fileImports = fileContent.matchAll(/import\s+(.*)\s+from\s+['"](.*)['"];?/g);
    for (const match of fileImports) {
        const importVar = match[1] + '_' + Math.random().toString(36).substring(7);
        const importFileUrl = match[2];
        fileContent = fileContent.replace(match[0], '');
        fileContent = fileContent.replace(match[1], importVar);
        if (importFileUrl.startsWith('.')) {
            bundle += `let ${importVar} = '${bundler(path.join(path.dirname(fileUrl), importFileUrl))}';\n ${fileContent}\n`;
        } else {
            bundle += `const ${importVar} = require('${importFileUrl}');\n ${fileContent}\n`;
        }
    }
    return bundle;
}
