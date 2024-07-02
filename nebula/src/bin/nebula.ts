#!/usr/bin/env node

import { exec } from "child_process";
import * as esbuild from "esbuild";
import prompt from "../cli/prompt";
import fs from "fs";
import pc from 'picocolors';
import listFiles from "../cli/ListFiles";

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
            const distFolder = "dist";
            console.log(pc.cyan("Building project..."));
            const buildTime = process.hrtime();
            console.log(pc.yellow("Cleaning up dist folder..."));
            if (fs.existsSync(distFolder))
                fs.rmSync(distFolder, { recursive: true });
            fs.mkdirSync(distFolder);
            console.log(pc.yellow("Building project..."));
            await listFiles('./app/pages').then(files => {
                esbuild.build({
                    entryPoints: files,
                    bundle: true,
                    platform: 'browser',
                    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
                    outdir: distFolder,
                    minify: true,
                }).catch(() => process.exit(1));
            });
            const endBuildTime = process.hrtime(buildTime);
            const time = (endBuildTime[0] * 1000) + (endBuildTime[1] / 1000000);
            console.log(pc.green(`Project built successfully at ${time.toFixed(3)}ms`));
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