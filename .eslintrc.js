module.exports = {
    "env": {
        "es2020": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended"
    ],
    "ignorePatterns": [
        "**/*.js",
        "**/*.mjs",
        "**/*.d.ts"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "license-header"
    ],
    "rules": {
        "max-len": ["warn", 120],
        "no-console": "error",
        "no-multiple-empty-lines": "warn",
        "no-trailing-spaces": "warn",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": ["warn",
            {
                "argsIgnorePattern": "^_"
            }
        ],
        "@typescript-eslint/no-var-requires": "off",
        "license-header/header": ["error", "./LICENSE_HEADER"]
    }
};
