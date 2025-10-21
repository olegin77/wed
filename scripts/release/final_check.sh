#!/usr/bin/env bash
set -euo pipefail
scripts/build/write-build-id.sh
echo "Run Lighthouse manually via workflow with prod URL"
echo "Check /health endpoints for all public services"
