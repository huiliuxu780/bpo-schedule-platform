#!/usr/bin/env bash
# Verification gate: lint + typecheck + build + frontend model tests + backend tests.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

preferred_node_dir="${BPO_NODE22_BIN:-/opt/homebrew/opt/node@22/bin}"
node_major=""

if command -v node >/dev/null 2>&1; then
  node_major="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || true)"
fi

if [[ "$node_major" != "22" ]]; then
  if [[ -x "$preferred_node_dir/node" && -x "$preferred_node_dir/npm" ]]; then
    export PATH="$preferred_node_dir:$PATH"
    hash -r 2>/dev/null || true
    node_major="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || true)"
  fi
fi

if [[ "$node_major" != "22" ]]; then
  echo "unsupported Node.js runtime: expected Node.js 22" >&2
  echo "install Homebrew node@22 or set BPO_NODE22_BIN to a directory containing node and npm" >&2
  exit 1
fi

echo "using Node.js $(node -v) at $(command -v node)"

backend_python="$(bash scripts/verify-backend-runtime.sh --print-path)"
echo "using backend Python $("$backend_python" -c 'import sys; print(sys.executable)')"

if [[ ! -x "node_modules/.bin/next" ]]; then
  echo "frontend dependencies missing: run npm install first" >&2
  exit 1
fi

# Frontend model tests (product structure + domain models, import .ts sources directly)
node --experimental-strip-types --test scripts/tests/*.test.mjs

# Frontend static checks
npm run lint
npm run typecheck
npm run build

# Backend tests
"$backend_python" -m unittest discover -s backend/tests

echo "check passed"
