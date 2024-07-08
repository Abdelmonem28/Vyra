#!/usr/bin/env node

import { exec } from "child_process";
import * as esbuild from "esbuild";
import prompt from "../cli/prompt";
import path from "path";
import fs from "fs";
import pc from 'picocolors';
import listFiles from "../cli/ListFiles";

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
        exec(`node ${path.join(__dirname, '../server/server.js')}`, (error, stdout, stderr) => {
            if (error)
                console.log(error);
        });
        listFiles('./app/pages').then(files => {
            files.forEach(file => fs.watchFile(file, { interval: 1000 }, () => {
                console.log(file, ' is watching');
            }));
        });
        break;
    default:
        console.log(`Unknown command: ${command}` + `\n\n` + `Usage: nebula <command>` + `\n\n` + `where <command> is one of:\n\nbuild\nit will build the project\n\ndev\nit will start the development server and watch for changes\n\n`);
        process.exit(1);
}