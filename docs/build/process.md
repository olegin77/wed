# Build and Verification Pipeline

This guide captures the complete local build pipeline for the monorepo and mirrors the
GitHub Actions workflow (`.github/workflows/ci.yml`). Every step below has been verified
manually on the current codebase.

## Prerequisites

- **Node.js 20** – matches the runtime configured in CI (`actions/setup-node@v4` with
  `node-version: 20`).
- **pnpm 10** – install via `corepack enable && corepack prepare pnpm@10 --activate` or
  use the version bundled with Node 20's Corepack integration.
- **Workspace install** – this repository is a pnpm workspace. All commands are executed
  from the repository root (`/workspace/wed`).

> **Note**
> The first install run prints a warning about "Ignored build scripts" for packages such
> as Prisma. Approve them when you need to run Prisma generators with
> `pnpm approve-builds`, otherwise the dependency installation completes successfully.

## 1. Install dependencies

```bash
pnpm install
```

- Installs all workspace dependencies using the lockfile (`pnpm-lock.yaml`).
- Verified output includes `Scope: all 18 workspace projects` and
  `Done in … using pnpm v10.5.2`.
- Expect the optional "Ignored build scripts" warning described above.

## 2. Lint

```bash
pnpm run lint
```

- This script chains two commands:
  - `pnpm -w -r --if-present run lint` – runs each package's individual lint script when
    defined.
  - `pnpm exec eslint .` – executes the root ESLint configuration against the entire
    workspace.
- Current run completes successfully but emits a Node warning because `eslint.config.js`
  is interpreted as an ES module. To silence it, add `"type": "module"` to the root
  `package.json` or convert the config to CommonJS.

## 3. Tests

```bash
pnpm -w -r run test --if-present
```

- Executes every workspace test script that exists. Packages without tests are skipped
  automatically because of `--if-present`.
- On the current tree the command returns immediately after printing the pnpm wrapper
  message, indicating no additional per-package test scripts beyond those already covered
  by the lint stage.

## 4. Build

```bash
pnpm -w -r run build --if-present
```

- Tries to run each workspace `build` script. At present none of the packages define
  such a script, so pnpm reports `None of the selected packages has a "build" script` and
  exits successfully.
- When future packages add a build step, this command will execute them in topological
  order, failing fast if any build script exits with a non-zero status.

## 5. CI parity checklist

| Step | Command | Status | Notes |
| ---- | ------- | ------ | ----- |
| Install | `pnpm install` | ✅ Verified | Warning about ignored build scripts is expected. |
| Lint | `pnpm run lint` | ✅ Verified | Node emits a module-type warning; harmless but documented. |
| Tests | `pnpm -w -r run test --if-present` | ✅ Verified | No package-specific test scripts beyond the workspace wrapper. |
| Build | `pnpm -w -r run build --if-present` | ⚠️ No scripts | Command succeeds; reports lack of `build` scripts. |

## Troubleshooting

| Symptom | Resolution |
| ------- | ---------- |
| `ERR_MODULE_NOT_FOUND` for `@eslint/eslintrc` during lint | Ensure dependencies are installed with `pnpm install` before running lint. |
| Persistent Node warning about module type | Add `"type": "module"` to `package.json` or convert `eslint.config.js` to CommonJS. |
| Need to run Prisma generators | Approve build scripts once via `pnpm approve-builds`. |

## Automation reference

- GitHub Actions workflow: `.github/workflows/ci.yml`
- Runs on pushes to the `codex` branch.
- Executes the same three commands after installing dependencies.

