import fs from "fs";
import path from "path";
import util from 'util';

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

export default async function listFiles(directoryPath: string): Promise<string[]> {
    const arr: string[] = [];
    const files = await readdir(directoryPath);
    for (const file of files) {
        const fullPath = path.join(directoryPath, file);
        const stats = await stat(fullPath);
        if (stats.isDirectory()) {
            arr.push(...await listFiles(fullPath));
        } else {
            arr.push(fullPath);
        }
    }
    return arr;
}