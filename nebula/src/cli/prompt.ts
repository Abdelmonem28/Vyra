import readline from "readline";



export default function prompt(question: string, defaultValue: string = ''): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

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
