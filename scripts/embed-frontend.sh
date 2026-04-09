#!/usr/bin/env bash
# Build frontend and copy built files into Spring Boot resources/static
# Usage: ./scripts/embed-frontend.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONT_DIR="$ROOT_DIR/frontend"
TARGET_DIR="$ROOT_DIR/itp-ecommerce/src/main/resources/static"

if [ ! -d "$FRONT_DIR" ]; then
  echo "Frontend directory not found: $FRONT_DIR"
  exit 1
fi

echo "Installing frontend dependencies (if needed)..."
npm --prefix "$FRONT_DIR" install --no-audit --no-fund

# Use environment variable if present to control build mode
BUILD_CMD="npm --prefix \"$FRONT_DIR\" run build"
if [ "${CI:-}" = "true" ]; then
  echo "CI mode: running build with --silent"
  $BUILD_CMD --silent
else
  echo "Building frontend (npm run build)..."
  $BUILD_CMD
fi

BUILD_DIR="$FRONT_DIR/dist"
if [ ! -d "$BUILD_DIR" ]; then
  echo "Build failed: $BUILD_DIR does not exist"
  exit 1
fi

mkdir -p "$TARGET_DIR"

# Optional safety: backup existing static files
if [ -d "$TARGET_DIR" ] && [ "$(ls -A "$TARGET_DIR")" ]; then
  BACKUP_DIR="$ROOT_DIR/.static-backup-$(date +%Y%m%d%H%M%S)"
  echo "Backing up existing static files to: $BACKUP_DIR"
  mkdir -p "$BACKUP_DIR"
  cp -a "$TARGET_DIR/." "$BACKUP_DIR/"
fi

echo "Copying built files to Spring Boot static folder: $TARGET_DIR"
rm -rf "$TARGET_DIR"/*
cp -a "$BUILD_DIR/." "$TARGET_DIR/"

cat <<EOF
Done.
- Frontend built from: $FRONT_DIR
- Copied to: $TARGET_DIR
Now you can build the backend JAR with: cd itp-ecommerce && mvn package
(Or run the Spring Boot app and it will serve the frontend at /)
EOF