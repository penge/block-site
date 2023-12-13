/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "@stylistic/ts",
  ],
  rules: {
    indent: ["error", 2],
    quotes: ["error", "double", { avoidEscape: true }],
    "quote-props": ["error", "as-needed"],
    semi: ["error", "always"],
    "no-multi-spaces": ["error", { ignoreEOLComments: true }],
    "arrow-parens": ["error", "always"],
    "@stylistic/ts/comma-dangle": ["error", "always-multiline"],
  },
};

module.exports = config;
