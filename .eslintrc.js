module.exports = {
    parser: "@typescript-eslint/parser",
    env: {
        es6: true,
        node: true
    },
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parserOptions: {
        ecmaVersion: 2019,
        project: "./tsconfig.json",
        sourceType: "module"
    },
    rules: {
        indent: [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        quotes: [
            "error",
            "double"
        ],
        semi: [
            "error",
            "always"
        ]
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
    ],
};
