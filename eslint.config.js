import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
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
