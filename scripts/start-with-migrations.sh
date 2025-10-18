#!/usr/bin/env bash
set -euo pipefail
pnpm -C packages/prisma run migrate:deploy
exec "$@"
