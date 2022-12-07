module.exports = {
	"root": true,
	extends: [
		"eslint:recommended",
	],
	"rules": {
		"indent": ["error", "tab"],
		"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
		"no-trailing-spaces": "error",
		"eol-last": ["error", "always"],

		"comma-dangle": ["warn", "always-multiline"],
		"quotes": ["warn", "double"],
		"semi": ["warn", "always"],
		"array-bracket-spacing": ["warn", "never"],
		"object-curly-spacing": ["warn", "always"],
		"space-infix-ops": ["warn", { "int32Hint": false }],

		"eqeqeq": ["error", "always"],
		"no-var": "error",
		"prefer-const": "error",
		"no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
	},
};
