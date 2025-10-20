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
    env: { es2023: true, node: true },
    extends: ["eslint:recommended", "plugin:security/recommended-legacy"],
    plugins: ["security"],
    parserOptions: { ecmaVersion: 2023, sourceType: "module" },
    rules: {
      "no-console": "off",
      "security/detect-object-injection": "off",
    },
  }),
  {
    ignores: ["node_modules/", "dist/", "build/", ".next/", "coverage/"],
  },
];
