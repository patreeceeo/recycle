#!/bin/sh

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
PROJECT_ROOT=$(dirname "$SCRIPT_DIR")
OUTPUT_DIR="${PROJECT_ROOT}/docs"
DEV_SERVER_SCRIPT="${SCRIPT_DIR}/dev.sh"

# Clean up background process on exit
cleanup() {
  if [ -n "$SERVER_PID" ]; then
    echo "Stopping dev server..."
    kill "$SERVER_PID" 2>/dev/null
    wait "$SERVER_PID" 2>/dev/null
  fi
}

trap cleanup EXIT INT TERM

rm -rf "${OUTPUT_DIR}"

# Create output directory if it doesn't exist
mkdir -p "${OUTPUT_DIR}"

# Start dev server in background
echo "Starting dev server..."
sh "${DEV_SERVER_SCRIPT}" &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for server to start..."
max_wait=30
waited=0
while [ $waited -lt $max_wait ]; do
  if curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "Server is ready!"
    break
  fi
  sleep 1
  waited=$((waited + 1))
done

if [ $waited -eq $max_wait ]; then
  echo "Error: Server did not start within ${max_wait} seconds"
  exit 1
fi

# Small delay to ensure server is fully ready
sleep 2

wget \
  --mirror \
  --convert-links \
  --page-requisites \
  --no-parent \
  --no-host-directories \
  --domains=localhost \
  --cut-dirs=0 \
  --directory-prefix="${OUTPUT_DIR}" \
  --quiet \
  --show-progress \
  http://localhost:8000/

echo "Snapshot captured to ${OUTPUT_DIR}"
