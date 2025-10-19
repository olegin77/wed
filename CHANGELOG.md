# Changelog

## [Unreleased]
### Added
- Introduced `@wt/security` header utilities to apply default hardening headers across Node services.
- Wired vendor service HTTP responses to use the shared security headers helper.
- Scaffolded an admin landing page with high-level sections for media moderation, vendor verification, and event logs.
### Fixed
- Sanitised the log ingestion service filenames and explained the lint exceptions for dynamic fs calls.
- Declared browser/runtime globals for the service worker and k6 scripts to clear `no-undef` warnings.
- Replaced unsafe calendar regex parsers with deterministic string walkers to satisfy security linting.
