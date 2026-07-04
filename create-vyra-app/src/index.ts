#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import pc from 'picocolors';
import prompt from './cli/prompt.ts';
import copyDirectory from './cli/Copy.ts';
import createPackage from './create-package.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log(pc.bold(pc.cyan('\n  Welcome to Nebula ✦\n')));

(async () => {
    const appName = await prompt(`  App name: `, 'my-nebula-app');
    const useTs = await prompt(`  TypeScript? (y/N): `, 'n');
    const install = await prompt(`  Install dependencies? (Y/n): `, 'y');

    // ← path.join instead of backslashes — works on all OS
    const appDir = path.join(process.cwd(), appName);

    if (fs.existsSync(appDir)) {
        console.error(pc.red(`\n  Directory "${appName}" already exists.\n`));
        process.exit(1);
    }

    const isTs = useTs.toLowerCase() === 'y';
    const template = isTs ? 'ts' : 'js';

    fs.mkdirSync(appDir, { recursive: true });

    // Copy the right template
    const templateDir = path.join(__dirname, '..', 'templates', template);
    await copyDirectory(templateDir, appDir);

    // Write the generated package.json
    const pkg = createPackage(appName, isTs);
    fs.writeFileSync(
        path.join(appDir, 'package.json'),
        JSON.stringify(pkg, null, 2)
    );

    // Auto-install
    if (install.toLowerCase() !== 'n') {
        console.log(pc.dim('\n  Installing dependencies...\n'));
        execSync('npm install', { cwd: appDir, stdio: 'inherit' });
    }

    // Success message
    console.log(pc.bold(pc.green(`\n  Created ${appName} successfully!\n`)));
    console.log(`  Next steps:\n`);
    console.log(pc.cyan(`    cd ${appName}`));
    if (install.toLowerCase() === 'n') {
        console.log(pc.cyan(`    npm install`));
    }
    console.log(pc.cyan(`    npm run dev\n`));
})();