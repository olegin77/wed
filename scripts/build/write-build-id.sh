#!/usr/bin/env bash
set -euo pipefail
id="$(date +%s)"
mkdir -p public
echo "$id" > public/build-id.txt
echo "build-id: $id"
