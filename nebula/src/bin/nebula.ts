#!/usr/bin/env node

import prompt from "../cli/prompt";

const args = process.argv.slice(2);



if (args.length === 0) {
    console.log("Usage: nebula <command>");
    process.exit(1);
}

const command = args[0];

switch (command) {
    case "build":
        console.log("Building project...");
        break;
    case "dev":
        
        ;
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
        console.log(`Unknown command: ${command}` + `\n\n` + `Usage: nebula <command>` + `\n\n` + `where <command> is one of:

        build
        it will build the project

        dev
        it will start the development server and watch for changes\n\n`);
        process.exit(1);
}