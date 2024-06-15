import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export default function prompt(question: string, defaultValue: string = ''): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            if (!answer) {
                answer = defaultValue;
            }
            resolve(answer);
        });
    });
}
