#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

preferred_node_dir="${BPO_NODE22_BIN:-/opt/homebrew/opt/node@22/bin}"
node_major=""

if command -v node >/dev/null 2>&1; then
  node_major="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || true)"
fi

if [[ "$node_major" != "22" && -x "$preferred_node_dir/node" && -x "$preferred_node_dir/npm" ]]; then
  export PATH="$preferred_node_dir:$PATH"
  hash -r 2>/dev/null || true
  node_major="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || true)"
fi

if [[ "$node_major" != "22" ]]; then
  echo "unsupported Node.js runtime: expected Node.js 22" >&2
  echo "install Homebrew node@22 or set BPO_NODE22_BIN to a directory containing node and npm" >&2
  exit 1
fi

echo "using Node.js $(node -v) at $(command -v node)"

node scripts/verify-frontend-native-runtime.mjs

if [[ "${BPO_DEV_DRY_RUN:-0}" == "1" ]]; then
  echo "frontend dev dry run passed"
  exit 0
fi

exec ./node_modules/.bin/next dev --webpack "$@"
