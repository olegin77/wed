#!/usr/bin/env bash
set -euo pipefail
: "${DATABASE_URL:=postgresql://pg:pg@localhost:5434/wt}"
OUT="backups/$(date +%Y-%m-%d)"
mkdir -p "$OUT"
pg_dump "$DATABASE_URL" > "$OUT/wt.sql"
find backups -type d -mtime +7 -exec rm -rf {} +
echo "backup done: $OUT/wt.sql"
