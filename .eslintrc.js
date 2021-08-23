module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "./node_modules/gts/",
        "plugin:unicorn/recommended",
    ],
    env: {
        es6: true,
        jest: true,
    },
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: "module",
    },
    plugins: ["eslint-plugin-tsdoc", "unicorn", "simple-import-sort", "import"],
    rules: {
        indent: ["warn", 4, { SwitchCase: 1 }],
        quotes: ["warn", "double"],
        radix: "error",
        complexity: ["error", 2],
        "node/no-unpublished-import": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/no-unused-vars": [2, { args: "none" }],
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/prefer-interface": "off",
        "@typescript-eslint/indent": "off",
        "tsdoc/syntax": "error",
        "unicorn/filename-case": "off",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",
        "max-len": ["warn", { code: 120 }],
    },
};
