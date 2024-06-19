import listFiles from "./ListFiles";
import fs from "fs";
import bundler from "./bundler";
import path from "path";

type Config = {
        pages?: string;
        typeScript?: boolean;
        dist?: string;
}

export default async function compile(distFolder: string): Promise<void> {
        const files = await listFiles("./app/pages");
        let config: Config = {};
        if (fs.existsSync('nebula.config.json')) {
                config = JSON.parse(fs.readFileSync('nebula.config.json', 'utf8'));
        }

        for (const file of files) {
                const folder = path.dirname(file.replace(config.pages || 'app/pages', ''));
                const distfile = path.join(distFolder, file.replace(config.pages || 'app/pages', ''));
                if (!fs.existsSync(path.join(distFolder, folder)))
                        fs.mkdirSync(path.join(distFolder, folder), { recursive: true });
                fs.writeFileSync(distfile, `${bundler(file)}\n`, { flag: 'a' });
        }
}