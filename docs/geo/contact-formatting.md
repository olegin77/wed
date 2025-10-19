# Contact formatting reference

- **Phone masks:** See `packages/geo/format/index.ts` for `phoneMasks` covering Uzbekistan, Kazakhstan, Kyrgyzstan, and Azerbaijan.
- **Address formats:** `addressFormats` defines the preferred ordering for form fields; use `getAddressFormat(code)` to retrieve them.
- **Fallback:** Unknown countries reuse the Uzbekistan layout to keep forms usable.
- **Usage:** Pair with locale detection to present the right mask and field order on onboarding flows.
