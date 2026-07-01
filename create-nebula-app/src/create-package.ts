export default function Package(
    appName: string,
    typeScript: boolean,
) {
    if (typeScript)
        return {
            name: appName,
            version: "1.0.0",
            description: "Nebula is a simple and easy to use library for creating web applications.",
            scripts: {
                "start": "nebula start",
                "build": "nebula build",
                "test": "nebula test"
            },
            dependencies: {
                "nebula": "^1.0.0"
            },
            devDependencies: {
                "@types/node": "^14.14.37",
                "typescript": "^4.2.4"
            },
            liscense: "MIT"
        }
    return {
        name: appName,
        version: "1.0.0",
        description: "Nebula is a simple and easy to use library for creating web applications.",
        "scripts": {
            "dev": "vite",
                "build": "vite build",
                    "preview": "vite preview"
        },
        "dependencies": {
            "nebula": "^1.0.0"
        },
        "devDependencies": {
            "vite": "^5.0.0"
        }
    
}
};