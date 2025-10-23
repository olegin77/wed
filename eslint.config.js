const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  ...compat.config({
    root: true,
    env: { es2023: true, node: true, browser: true },
    extends: ["eslint:recommended"],
    parserOptions: { 
      ecmaVersion: 2023, 
      sourceType: "module",
      ecmaFeatures: {
        jsx: true
      }
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-empty": "warn"
    },
  }),
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      ".next/",
      "coverage/",
      "**/.next/**",
      "**/export/**",
      "**/*.d.ts",
      "**/*.ts",
      "**/*.tsx"
    ],
  },
];
