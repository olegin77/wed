#!/usr/bin/env bash
set -euo pipefail
dir="${1:-media}"
out="${2:-media_out}"
find "$dir" -type f -name "*.jpg" -o -name "*.png" | while read -r f; do
  node -e 'import("./node.mjs").then(async m=>{ const {resize}=await import("../../packages/media/src/optimize.ts"); await resize(process.argv[1],process.argv[2],[480,960,1440]); process.exit(0); })' "$f" "$out"
done
