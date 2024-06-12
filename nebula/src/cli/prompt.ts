import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export default function askQuestion(question: string) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}