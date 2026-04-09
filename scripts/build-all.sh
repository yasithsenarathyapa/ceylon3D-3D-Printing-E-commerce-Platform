#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONT_DIR="$ROOT_DIR/frontend"
BACK_DIR="$ROOT_DIR/itp-ecommerce"

# Build frontend
npm --prefix "$FRONT_DIR" install --no-audit --no-fund
npm --prefix "$FRONT_DIR" run build

# Copy into backend static
"$ROOT_DIR/scripts/embed-frontend.sh"

echo "Build and embed complete. You can now build the backend: cd itp-ecommerce && mvn package"