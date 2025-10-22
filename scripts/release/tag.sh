#!/usr/bin/env bash
set -euo pipefail
git tag -a v1.0.0 -m "WeddingTech UZ 1.0"
git push --tags
./scripts/release/final_check.sh
