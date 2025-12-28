#!/bin/sh

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
PROJECT_ROOT=$(dirname "$SCRIPT_DIR")
OUTPUT_DIR="${PROJECT_ROOT}/snapshot"
PORT=8000
BASE_URL="/recycle/"

# Clean up background process on exit
cleanup() {
  kill -9 $(lsof -i :$PORT -Fp | sed -E 's/.([0-9]+)/\1/')
}

trap cleanup EXIT INT TERM

rm -rf "${OUTPUT_DIR}"

# Create output directory if it doesn't exist
mkdir -p "${OUTPUT_DIR}"

# Start server in background
echo "Starting server..."

os_flags() {
  if [ "$(uname)" = "Linux" ];then
    echo "--linker legacy"
  fi
}

ROC_BASIC_WEBSERVER_PORT=$PORT BASE_URL="${BASE_URL}" roc run src/DevServer.roc $(os_flags) &

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

wget \
  --mirror \
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
ls -lR $OUTPUT_DIR

# Move linked local docs
set -x
cp -a "${OUTPUT_DIR}${BASE_URL}*" "${OUTPUT_DIR}"
rm -rf "${OUTPUT_DIR}${BASE_URL}"
set +x

ls -lR $OUTPUT_DIR

