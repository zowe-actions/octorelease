const globals = require("globals");
const jestPlugin = require("eslint-plugin-jest");
const licenseHeaderPlugin = require("eslint-plugin-license-header");
const tsEslintPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
    {
        ignores: [
            "**/*.js",
            "**/*.mjs", 
            "**/*.d.ts",
            "**/dist/",
            "**/lib/",
            "**/node_modules/"
        ]
    },
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                ...globals.node,
                ...jestPlugin.environments.globals.globals,
            }
        },
        plugins: {
            "@typescript-eslint": tsEslintPlugin,
            "jest": jestPlugin,
            "license-header": licenseHeaderPlugin,
        },
        rules: {
            ...tsEslintPlugin.configs.recommended.rules,
            ...jestPlugin.configs.recommended.rules,
            "max-len": ["warn", 120],
            "no-console": "error",
            "no-multiple-empty-lines": "warn",
            "no-trailing-spaces": "warn",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-unused-vars": ["warn", {
                "argsIgnorePattern": "^_"
            }],
            "license-header/header": ["error", "./LICENSE_HEADER"],
        }
    }
];
