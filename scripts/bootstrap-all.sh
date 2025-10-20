#!/usr/bin/env bash
# bootstrap-all.sh — one-click bootstrap for the WeddingTech monorepo.
#
# The script verifies prerequisites, installs dependencies, runs the
# quality gates (lint/test/build) and optionally starts local
# infrastructure and workspace services. It is idempotent and safe to
# re-run.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PNPM_VERSION="${PNPM_VERSION:-9.12.0}"
WITH_INFRA=true
START_SERVICES=true
RUN_TESTS=true
RUN_BUILD=true

usage() {
  cat <<'USAGE'
Usage: scripts/bootstrap-all.sh [options]

Options:
  --no-infra      Skip starting Docker-based local infrastructure.
  --no-start      Skip starting workspace services after successful checks.
  --skip-tests    Skip the test suite (lint still runs).
  --skip-build    Skip the build step.
  -h, --help      Show this help and exit.

Environment variables:
  PNPM_VERSION    Override the pnpm version prepared via Corepack (default: 9.12.0).
USAGE
}

while (($#)); do
  case "$1" in
    --no-infra) WITH_INFRA=false ;;
    --no-start) START_SERVICES=false ;;
    --skip-tests) RUN_TESTS=false ;;
    --skip-build) RUN_BUILD=false ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
  shift
done

log() {
  printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1"
}

log "Ensuring we are at the repository root"
cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required but not installed. Please install Node.js 20 or newer." >&2
  exit 1
fi

NODE_VERSION="$(node --version | sed 's/^v//')"
NODE_MAJOR="${NODE_VERSION%%.*}"
if (( NODE_MAJOR < 20 )); then
  echo "Node.js >= 20 is required (found v$NODE_VERSION)." >&2
  exit 1
fi

if ! command -v corepack >/dev/null 2>&1; then
  echo "Corepack is required to provision pnpm. Install Node.js 16.13+ or add Corepack manually." >&2
  exit 1
fi

log "Activating pnpm@$PNPM_VERSION via Corepack"
corepack enable >/dev/null 2>&1 || true
corepack prepare "pnpm@${PNPM_VERSION}" --activate

log "Installing workspace dependencies"
pnpm install --frozen-lockfile

log "Running lint checks"
pnpm run lint

if $RUN_TESTS; then
  log "Running test suite"
  pnpm run test
else
  log "Skipping tests as requested"
fi

if $RUN_BUILD; then
  log "Running build pipeline"
  TMP_BUILD_LOG="$(mktemp)"
  if pnpm run build | tee "$TMP_BUILD_LOG"; then
    if grep -q 'None of the selected packages has a "build" script' "$TMP_BUILD_LOG"; then
      log "No workspace defines a build script; skipping artifact compilation"
    fi
  else
    log "Build pipeline failed"
    cat "$TMP_BUILD_LOG"
    rm -f "$TMP_BUILD_LOG"
    exit 1
  fi
  rm -f "$TMP_BUILD_LOG"
else
  log "Skipping build as requested"
fi

if $WITH_INFRA; then
  COMPOSE_FILE="$ROOT_DIR/infra/local/docker-compose.yml"
  if [ -f "$COMPOSE_FILE" ]; then
    if command -v docker >/dev/null 2>&1; then
      if docker compose version >/dev/null 2>&1; then
        log "Starting local infrastructure via docker compose"
        docker compose -f "$COMPOSE_FILE" up -d
      elif command -v docker-compose >/dev/null 2>&1; then
        log "Starting local infrastructure via docker-compose"
        docker-compose -f "$COMPOSE_FILE" up -d
      else
        log "Docker compose is not available; skipping infrastructure start"
      fi
    else
      log "Docker is not available; skipping infrastructure start"
    fi
  else
    log "No local docker-compose.yml found; skipping infrastructure start"
  fi
else
  log "Skipping infrastructure start as requested"
fi

if $START_SERVICES; then
  log "Starting workspace services in parallel (press Ctrl+C to stop)"
  pnpm -w -r --if-present --parallel --stream run start
else
  log "Skipping workspace start as requested"
fi

log "Bootstrap sequence finished"
