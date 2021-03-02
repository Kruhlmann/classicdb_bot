module.exports = {
    parser: "@typescript-eslint/parser",
    env: {
        es6: true,
        node: true,
    },
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parserOptions: {
        ecmaVersion: 2019,
        project: "./tsconfig.json",
        sourceType: "module",
    },
    rules: {
        indent: ["error", 4, { SwitchCase: 1 }],
        quotes: ["warn", "double"],
        "node/no-unpublished-import": 0,
        "tsdoc/syntax": "error",
        "unicorn/filename-case": "off",
        "simple-import-sort/sort": "error",
        "sort-imports": "off",
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",
        "max-len": ["error", { code: 120 }],
    },
    plugins: ["@typescript-eslint"],
    extends: ["eslint:recommended"],
};
