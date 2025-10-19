# Codex Agents Configuration

## Execution
agent:
mode: fully_automatic
approvals:
  require_approval: false
  ask_to_proceed: "never"
  human_in_the_loop: "none"
  auto_confirm: true
safety:
  confirm_shell: false
  confirm_file_write: false
  confirm_commit: false

tasks:
  source: "docs/CODEX_TASKS.md"
  format: "checklist"
  code_block_lang: "bash"
  stop_on_failure: false
  one_commit_per_task: true
  respect_depends: true
  idempotent_steps: true

git:
  enabled: true
  branch: "codex"
  push: true
  commit_strategy: "one_commit_per_task"
  commit_message_template: "Codex: {{task_id}} {{task_title}}"

repo_policy:
  protected_branch: true
  default_branch: "main"
  allow_direct_push: false
  require_pull_request: true
  pull_request:
    base: "main"
    head: "codex"
    title: "Codex Auto PR"
    body: "Automated changes from Codex tasks."
    labels: ["automerge", "codex"]
    draft: false

auto_merge:
  enabled: true
  strategy: "merge"    # merge | squash | rebase
  require_status_checks: true
  required_labels: ["automerge"]
  block_on_change_requests: true

ci:
  expect:
    - ".github/workflows/ci.yml"

telemetry:
  log_commits: true
  log_failures: true
sandbox:
    allow_exec:
      - "codex"
      - "bash"
      - "git"
      - "node"
      - "pnpm"
    no_tty: true

## Security headers helper

- Added a shared `packages/security/headers.js` helper that sets hardened HTTP response headers (`X-Frame-Options`, `Permissions-Policy`, `Cross-Origin-*`).
- Vendor service now applies these defaults to every request to reduce clickjacking and resource isolation risks.

## Admin UI skeleton

- Added `apps/svc-admin/src/pages/index.tsx` with a React-based landing page that lists core moderation areas (медиа, документы, журналы).
- Documented the placeholder flow in `docs/admin/overview.md` so teams know where to extend the panel.
- Introduced `apps/svc-admin/src/moderation/reviews.ts` with a documented `canPublishReview` rule enforcing contract verification before a review is published.

## Maintenance fixes

- Normalized the log ingestion service to write into a deterministic `logs/` directory with sanitized daily filenames and documented why the security linter ignores the dynamic path.
- Declared the service worker and k6 runtime globals so eslint no longer raises undefined-variable errors in the public assets and load tests.
- Replaced unsafe regular expressions in `packages/ical/index.js` with deterministic parsers to satisfy `security/detect-unsafe-regex` without changing behaviour.

## Search utilities

- Added `@wt/search` with an in-memory TF-IDF index, keyword extraction helper, and normalisation utilities for multilingual content.

## Media pipeline

- Expanded `@wt/media` to generate multi-format variants, expose batch helpers, and return metadata for responsive asset workflows.

## Catalog reference

- Rebuilt the vendor category directory with locale-aware titles, hierarchy helpers, and substring search utilities.

## Budget presets

- Modelled budget tiers and guest-count segments with helper functions to compute region-aware recommendations.

## Uzbekistan geo reference

- Expanded `@wt/geo/uz` with regional metadata, major cities, and search helpers for onboarding and filtering flows.

