export default function Package(
    appName: string,
){
    return {
        name: appName,
        version: "1.0.0",
        description: "Nebula is a simple and easy to use library for creating web applications.",
        scripts: {},
        dependencies: {
            "nebula": "^1.0.0"
        },
        liscense: "MIT"
    }
};