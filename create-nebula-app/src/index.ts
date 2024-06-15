#!/usr/bin/env node
import Package from "./create-package";
import * as fs from "fs";
import prompt from './cli/prompt';
import copyDirectory from './cli/Copy';
import pc from 'picocolors';


console.log("Welcome to Nebula CLI");
(async () => {
    const appName = await prompt(pc.bold(pc.cyan("What is the name of your app: ")), "my-nebula-app");
    const appDir = `${process.cwd()}\\${appName}`;
    if (fs.existsSync(appDir)) {
        console.log(`The directory ${appDir} already exists`);
        process.exit(1);
    }
    fs.mkdirSync(appDir);
    const packageJson = Package(appName);
    fs.writeFileSync(`${appDir}\\package.json`, JSON.stringify(packageJson, null, 2));
    copyDirectory(`${__dirname}\\..\\templates\\default`, appDir);

    console.log("Created Nebula app", appName);
})();
