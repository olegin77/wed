#!/usr/bin/env bash
set -euo pipefail
IN="$1"
OUT="$2"
node -e "(async () => { const { resize } = await import('../../packages/media/src/optimize.ts'); await resize(process.argv[1], process.argv[2], [256]); })().catch((err) => { console.error(err); process.exit(1); });" "$IN" "$OUT"
