#!/usr/bin/env bash
set -euo pipefail

# Ensure any container or deployment entrypoint applies pending Prisma migrations
# using the monorepo-level helper so every service works with the latest schema
# before starting the actual runtime command passed to this script.
pnpm run prisma:deploy
exec "$@"
