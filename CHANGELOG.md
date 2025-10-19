# Changelog

## [Unreleased]
### Added
- Introduced `@wt/security` header utilities to apply default hardening headers across Node services.
- Wired vendor service HTTP responses to use the shared security headers helper.
- Scaffolded an admin landing page with high-level sections for media moderation, vendor verification, and event logs.
- Documented the review publication rule in `apps/svc-admin/src/moderation/reviews.ts`, enforcing contract verification for moderation workflows.
- Implemented `@wt/search` with an in-memory TF-IDF index, keyword extraction helper, and multilingual normalisation utilities.
- Upgraded `@wt/media` to expose multi-format minification, batch variant generation, and metadata extraction helpers.
- Reworked `packages/catalog/categories.ts` with hierarchical locale-aware categories and helper utilities for navigation and search.
- Introduced budget and guest presets with regional multipliers to produce spend recommendations in `packages/catalog/budget.ts`.
- Delivered a detailed Uzbekistan geo directory with regional metadata, key cities, and search helpers in `packages/geo/uz.ts`.
### Fixed
- Sanitised the log ingestion service filenames and explained the lint exceptions for dynamic fs calls.
- Declared browser/runtime globals for the service worker and k6 scripts to clear `no-undef` warnings.
- Replaced unsafe calendar regex parsers with deterministic string walkers to satisfy security linting.
