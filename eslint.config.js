import globals from "globals";
import vitestPlugin from "@vitest/eslint-plugin";
import licenseHeaderPlugin from "eslint-plugin-license-header";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
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
                ...vitestPlugin.environments.env.globals,
            }
        },
        plugins: {
            "@typescript-eslint": tsEslintPlugin,
            "vitest": vitestPlugin,
            "license-header": licenseHeaderPlugin,
        },
        rules: {
            ...tsEslintPlugin.configs.recommended.rules,
            ...vitestPlugin.configs.recommended.rules,
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
