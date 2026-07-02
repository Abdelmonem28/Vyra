export default function Package(
    appName: string,
    typeScript: boolean,
) {
    if (typeScript)
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