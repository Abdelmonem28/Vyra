import fs from "fs";
import path from "path";

export default async function copyDirectory(src: string, dest: string) {
    // Check if source directory exists
    if (!fs.existsSync(src)) {
        throw new Error(`Source directory "${src}" does not exist.`);
    }

    // Create destination directory if it does not exist
    if (!fs.existsSync(dest)) {
        await fs.promises.mkdir(dest, { recursive: true });
    }

    // Read all entries (files and directories) in the source directory
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    // Iterate over each entry
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Copy directory
            await copyDirectory(srcPath, destPath);
        } else {
            // Copy file
            await fs.promises.copyFile(srcPath, destPath);
        }
    }
}