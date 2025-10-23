#!/usr/bin/env bash
set -euo pipefail

# Fast build for the monorepo with sensible defaults.
# - Installs root deps (prefers lockfile via npm ci, falls back to npm install)
# - Compiles TS packages that ship sources
# - Builds the root Next.js app
# - Optionally builds apps/svc-website when INCLUDE_SVC_WEBSITE=1

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "[fast-build] Node: $(node -v) | npm: $(npm -v)"

# Avoid failing on engine warnings (Node 22 vs engines: 20.x)
export npm_config_engine_strict=false

echo "[fast-build] Installing root dependencies (ci || install)"
if ! npm ci --prefer-offline --no-audit --no-fund; then
  echo "[fast-build] npm ci failed or lock out-of-sync — retrying with npm install"
  npm install --no-audit --no-fund
fi

TS_BIN="$REPO_ROOT/node_modules/.bin/tsc"
if [[ -x "$TS_BIN" ]]; then
  echo "[fast-build] TypeScript version: $($TS_BIN -v)"
else
  echo "[fast-build] tsc not found in node_modules/.bin"
fi

# Compile TypeScript packages using root tsc to avoid per-package installs
compile_ts_package() {
  local pkg_path="$1"
  if [[ -f "$pkg_path/tsconfig.json" ]]; then
    echo "[fast-build] Compiling: $pkg_path"
    "$TS_BIN" -p "$pkg_path/tsconfig.json"
  else
    echo "[fast-build] Skip (no tsconfig): $pkg_path"
  fi
}

compile_ts_package "packages/shared"
compile_ts_package "packages/security"
compile_ts_package "packages/media"

echo "[fast-build] Building root Next.js app"
npm run --silent build

if [[ "${INCLUDE_SVC_WEBSITE:-0}" == "1" ]]; then
  echo "[fast-build] Building apps/svc-website (opt-in)"
  pushd apps/svc-website >/dev/null
  if ! npm ci --prefer-offline --no-audit --no-fund; then
    echo "[fast-build] (svc-website) npm ci failed — retrying with npm install"
    npm install --no-audit --no-fund
  fi
  npm run --silent build
  popd >/dev/null
fi

echo "[fast-build] Done"
