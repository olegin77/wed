module.exports = {
  root: true,
  env: { es2023: true, node: true },
  extends: ["eslint:recommended", "plugin:security/recommended-legacy"],
  plugins: ["security"],
  parserOptions: { ecmaVersion: 2023, sourceType: "module" },
  rules: {
    "no-console": "off",
    "security/detect-object-injection": "off"
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    ".next/",
    "coverage/"
  ]
};
