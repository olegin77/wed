# Changelog

## [Unreleased]
### Added
- Introduced documented UzPay, Payme, and Click payment provider stubs in `apps/svc-payments/providers/` with supporting notes in `docs/payments/providers.md`.
- Scaffolded the GraphQL gateway schema and resolver map in `apps/svc-gql/src/index.ts` with notes in `docs/api/graphql-gateway.md`.
- Added primitive rate-limiting helpers in `packages/ratelimit/index.ts` and middleware wiring in `packages/ratelimit/mw/index.ts` with documentation in `docs/architecture/rate-limit.md`.
- Published synchronous antifraud signal helpers in `packages/antifraud/signals/index.ts` with docs in `docs/security/fraud-signals.md`.
- Extended the lightweight i18n dictionary with Kazakh, Kyrgyz, and Azerbaijani locales and documented the additions in `docs/i18n/regional-locales.md`.
- Added geo formatting helpers (phone masks and address layouts) in `packages/geo/format/index.ts` with docs in `docs/geo/contact-formatting.md`.
- Published an in-memory entity graph skeleton in `packages/graph/index.ts` with documentation in `docs/architecture/entity-graph.md`.
- Delivered vendor demand analytics with seasonality slices in `apps/svc-analytics/src/vendor/index.{js,ts}` and documented usage in `docs/analytics/vendor-seasonality.md`.
- Introduced `@wt/security` header utilities to apply default hardening headers across Node services.
- Wired vendor service HTTP responses to use the shared security headers helper.
- Scaffolded an admin landing page with high-level sections for media moderation, vendor verification, and event logs.
- Documented the review publication rule in `apps/svc-admin/src/moderation/reviews.ts`, enforcing contract verification for moderation workflows.
- Delivered `LazyImg` in `apps/svc-website/src/ui/img/LazyImg.tsx` to provide lazy loading with intrinsic dimensions for public imagery.
- Implemented `@wt/search` with an in-memory TF-IDF index, keyword extraction helper, and multilingual normalisation utilities.
- Upgraded `@wt/media` to expose multi-format minification, batch variant generation, and metadata extraction helpers.
- Reworked `packages/catalog/categories.ts` with hierarchical locale-aware categories and helper utilities for navigation and search.
- Introduced budget and guest presets with regional multipliers to produce spend recommendations in `packages/catalog/budget.ts`.
- Delivered a detailed Uzbekistan geo directory with regional metadata, key cities, and search helpers in `packages/geo/uz.ts`.
- Curated hall+decor+music bundles under `apps/svc-catalog/src/bundles` with price allocation helpers and documentation in `docs/catalog/bundles.md`.
- Enhanced `apps/svc-notifier/src/index.ts` with a persistent notification feed, delivery tracking, and documented error handling helpers.
- Documented and extended `@wt/mlrank` with configurable offline score weights and clamped output helpers for catalogue ranking.
- Hardened `infra/feast/extract-features.ts` to normalise vendor metrics from mixed data sources and documented the supported fields in `docs/analytics/catalog-features.md`.
### Fixed
- Sanitised the log ingestion service filenames and explained the lint exceptions for dynamic fs calls.
- Declared browser/runtime globals for the service worker and k6 scripts to clear `no-undef` warnings.
- Replaced unsafe calendar regex parsers with deterministic string walkers to satisfy security linting.
