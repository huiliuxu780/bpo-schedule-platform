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

if ! python3 - <<'PY'
import importlib.util
import sys

missing = [
    name
    for name in ("fastapi", "uvicorn", "pydantic")
    if importlib.util.find_spec(name) is None
]

if missing:
    print(f"backend dev toolchain missing: {' '.join(missing)}", file=sys.stderr)
    print("install backend dependencies with: python3 -m pip install -r backend/requirements.txt", file=sys.stderr)
    raise SystemExit(1)
PY
then
  exit 1
fi

export BPO_API_BASE_URL="${BPO_API_BASE_URL:-http://127.0.0.1:8000}"

cleanup() {
  trap - INT TERM EXIT
  terminate_tree "${api_pid:-}"
  terminate_tree "${web_pid:-}"
}

terminate_tree() {
  local pid="${1:-}"

  if [[ -z "$pid" ]]; then
    return
  fi

  if command -v pgrep >/dev/null 2>&1; then
    local child
    for child in $(pgrep -P "$pid" 2>/dev/null || true); do
      terminate_tree "$child"
    done
  fi

  kill "$pid" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

echo "starting API at ${BPO_API_BASE_URL}"
python3 -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload &
api_pid=$!

echo "starting frontend at http://localhost:3000"
npm run dev &
web_pid=$!

exit_code=0

while true; do
  if ! kill -0 "$api_pid" 2>/dev/null; then
    wait "$api_pid" || exit_code=$?
    break
  fi

  if ! kill -0 "$web_pid" 2>/dev/null; then
    wait "$web_pid" || exit_code=$?
    break
  fi

  sleep 1
done

cleanup
exit "$exit_code"
