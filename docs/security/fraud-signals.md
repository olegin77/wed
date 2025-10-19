# Fraud signal catalog

- **Module:** `packages/antifraud/signals/index.ts`
- **Signals:**
  - `manyEnquiriesShortTime` — triggers when more than five enquiries occur within the last hour (`eqLastHour > 5`).
  - `ipMismatch` — triggers when registration and transaction IP countries do not match.
- **Usage:** Import `signals` and evaluate against an enriched context before running heavyweight scoring pipelines.
- **Extensibility:** Add new functions to the exported map; keep them synchronous to guarantee deterministic performance.
