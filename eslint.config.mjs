import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["**/dist/**", "**/node_modules/**", "**/.next/**", "**/coverage/**"]),

    js.configs.recommended,

    {
        files: ["**/*.{ts,tsx,mts,cts}"],
        extends: [...tseslint.configs.recommendedTypeChecked, eslintPluginPrettierRecommended],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-floating-promises": "warn",
            "@typescript-eslint/no-unsafe-argument": "warn",
            "prettier/prettier": "error",
        },
    },

    {
        files: ["**/*.{js,mjs,cjs}"],
        extends: [eslintPluginPrettierRecommended],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        rules: {
            "prettier/prettier": "error",
        },
    },

    {
        files: ["apps/api/**/*.ts"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            sourceType: "commonjs",
        },
    },

    {
        files: ["apps/front/**/*.{ts,tsx}"],
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            ...reactHooks.configs.flat.recommended.rules,
            ...reactRefresh.configs.vite.rules,
        },
    },

    {
        files: ["apps/front/src/components/ui/**/*.{ts,tsx}"],
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-call": "off",
        },
    },
]);
