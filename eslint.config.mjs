import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import js from "@eslint/js";
import globals from "globals";

const eslintConfig = defineConfig([
    ...nextVitals,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts"
    ]),
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: { js },
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        rules: {
            "sort-imports": [
                "error",
                {
                    allowSeparatedGroups: true
                }
            ]
        }
    }
]);

export default eslintConfig;
