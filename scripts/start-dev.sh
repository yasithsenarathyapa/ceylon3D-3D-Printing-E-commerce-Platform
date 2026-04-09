#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONT_DIR="$ROOT_DIR/frontend"
BACK_DIR="$ROOT_DIR/itp-ecommerce"

echo "Starting frontend dev server..."
npm --prefix "$FRONT_DIR" run dev -- --host &
FRONT_PID=$!

echo "Starting backend (mvn spring-boot:run)..."
(
  cd "$BACK_DIR"
  mvn spring-boot:run
) &
BACK_PID=$!

trap 'echo "Stopping..."; kill $FRONT_PID $BACK_PID 2>/dev/null || true; wait $FRONT_PID 2>/dev/null || true; wait $BACK_PID 2>/dev/null || true' EXIT

echo "Frontend PID: $FRONT_PID"
echo "Backend PID: $BACK_PID"

wait $FRONT_PID $BACK_PID