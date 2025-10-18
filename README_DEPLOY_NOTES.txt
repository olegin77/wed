# Deployment notes

- DigitalOcean App Platform parses a **`project.yml`** in repo root and fails on Codex-specific keys like `agent`.
- To avoid conflicts:
  - Move Codex config to **`.codex/project.yml`** (included here).
  - Provide a DigitalOcean App Spec at **`.do/app.yaml`** (included here).

## Steps
1. Delete/rename any root-level `project.yml` from the repository.
2. Commit `.codex/project.yml` and `.do/app.yaml`.
3. In DigitalOcean, point the app to use the App Spec file `.do/app.yaml` (auto-detected).
