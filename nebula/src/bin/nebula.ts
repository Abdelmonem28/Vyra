#!/usr/bin/env node

import compile from "../cli/compile";
import prompt from "../cli/prompt";
import fs from "fs";
import pc from 'picocolors';

type Config = {
    pages?: string;
    typeScript?: boolean;
    dist?: string;
}

const args = process.argv.slice(2);



if (args.length === 0) {
    console.log("Usage: nebula <command>");
    process.exit(1);
}

const command = args[0];

switch (command) {
    case "build":
        (async () => {
            let config: Config = {};
            const distFolder = config.dist || "dist";
            if (fs.existsSync('nebula.config.json')) {
                config = JSON.parse(fs.readFileSync('nebula.config.json', 'utf8'));
            }
            console.log(pc.cyan("Building project..."));
            if (fs.existsSync(distFolder))
                fs.rmSync(distFolder, { recursive: true });
            fs.mkdirSync(distFolder);
            compile(distFolder);
        })();
        break;
    case "dev":
        break;
    case "ask":
        (async () => {
            const name = await prompt("What is your name? ");
            const age = await prompt("What is your age? ");
            const sallary = await prompt("What is your sallary? ");
            console.log(`Hello, ${name}!`);
            console.log(`your age is, ${age}!`);
            console.log(`your sallary is, ${sallary}!`);
            process.exit(0);
        })();
        break;
    default:
        console.log(`Unknown command: ${command}` + `\n\n` + `Usage: nebula <command>` + `\n\n` + `where <command> is one of:\n\nbuild\nit will build the project\n\ndev\nit will start the development server and watch for changes\n\n`);
        process.exit(1);
}