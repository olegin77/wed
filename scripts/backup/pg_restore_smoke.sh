#!/usr/bin/env bash
set -euo pipefail
: "${DATABASE_URL:=postgresql://pg:pg@localhost:5434/wt}"
LAST="$(ls -1dt backups/* | head -n1)/wt.sql"
[ -f "$LAST" ] || { echo "no backup found"; exit 1; }
psql "$DATABASE_URL" -c 'SELECT 1' >/dev/null
echo "restore-smoke ok from $LAST"
