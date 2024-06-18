import fs from 'fs';

export default async function bundler(fileUrl: string) {
    let bundle = '';
    const fileContent = fs.readFileSync(fileUrl,  'utf8');
    const fileImports = fileContent.matchAll(/import\s+.*\s+from\s+['"](.*)['"]/g);
}