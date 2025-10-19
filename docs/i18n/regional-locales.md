# Regional locale bundle (KZ/KG/AZ)

- **Dictionaries:** JSON files live under `packages/i18n/{kk,kg,az}.json`.
- **Helper:** `packages/i18n/index.ts` loads the dictionaries via `createRequire` and exposes them through the `dict` map.
- **Locale keys:** `ok` and `save` are the first shared prompts; additional keys fall back to the request key when missing.
- **Usage:** Call `t(locale, key)`; type-safe `Locale` union now includes `kk`, `kg`, and `az` codes.
- **Next steps:** Extend dictionaries with onboarding copy as regional teams provide translations.
