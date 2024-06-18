import { exec } from "child_process";
import listFiles from "./ListFiles";
import fs from "fs";
import bundler from "./bundler";
import path from "path";

export default async function compile(distFolder: string): Promise<void> {
        const files = await listFiles("./app/pages");
        for (const file of files) {
                const folder = path.dirname(file.replace('app/pages', ''));
                const distfile = path.join(distFolder, file.replace('app/pages', ''));
                if (!fs.existsSync(path.join(distFolder, folder)))
                        fs.mkdirSync(path.join(distFolder, folder), { recursive: true });
                fs.writeFileSync(distfile, `${bundler(file)}\n`, { flag: 'a' });
        }
}