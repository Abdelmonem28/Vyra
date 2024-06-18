import { exec } from "child_process";
import listFiles from "./ListFiles";
import fs from "fs";

export default async function compile(distFolder: string): Promise<void>{
        const files = await listFiles("./app/pages");
        fs.writeFileSync(`${distFolder}/index.ts`, '');
}