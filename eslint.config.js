import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
	{ ignores: [".svelte-kit/", "build/", "dist/", "node_modules/", "harvest/", "**/*.svelte"] },
	js.configs.recommended,
	...tseslint.configs.recommended,
	prettier,
	{
		rules: {
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"prefer-const": "warn",
			"no-var": "error",
			eqeqeq: ["error", "always", { null: "ignore" }],
			curly: ["error", "all"],
			"no-throw-literal": "error",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
			],
			"@typescript-eslint/no-explicit-any": "warn",
		},
	},
	{
		files: ["scripts/**/*.mjs"],
		languageOptions: {
			globals: {
				Buffer: "readonly",
				console: "readonly",
				fetch: "readonly",
				process: "readonly",
			},
		},
		rules: {
			"no-console": "off",
		},
	}
);
