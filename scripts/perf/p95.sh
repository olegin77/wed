#!/usr/bin/env bash
set -euo pipefail
URL="${1:-http://localhost:3000/catalog/search?city=Tashkent}"
N=50; T=()
for i in $(seq 1 $N); do
  s=$(date +%s%3N); curl -sS "$URL" >/dev/null; e=$(date +%s%3N); T+=($((e-s)))
done
IFS=$'\n' sorted=($(sort -n <<<"${T[*]}")); unset IFS
idx=$((N*95/100-1)); echo "p95: ${sorted[$idx]} ms"
