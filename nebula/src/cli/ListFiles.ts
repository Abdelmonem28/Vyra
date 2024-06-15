import fs from "fs";
import path from "path";
import util from 'util';

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

export default async function listFiles(directoryPath: string): Promise<string[]> {
    // Create an array to store the file paths
    const arr: string[] = [];

    // Read all entries (files and directories) in the source directory
    const files = await readdir(directoryPath);

    // Iterate over each entry
    for (const file of files) {
        const fullPath = path.join(directoryPath, file);

        // Check if the entry is a directory
        const stats = await stat(fullPath);
        if (stats.isDirectory()) {
            // Recursively list files in the subdirectory
            arr.push(...await listFiles(fullPath));
        } else {
            // Add the file path to the array
            arr.push(fullPath);
        }
    }
    return arr;
}