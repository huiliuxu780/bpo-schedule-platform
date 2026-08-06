#!/usr/bin/env bash
# E2E behavioral check: seed a disposable database, start isolated backend/frontend
# processes on dedicated ports, then run the Playwright suite. Requires `npm run build`.
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

if [[ ! -f ".next/BUILD_ID" ]]; then
  echo "missing frontend build: run npm run build first" >&2
  exit 1
fi

backend_python="$(bash scripts/verify-backend-runtime.sh --require-dev-deps --print-path)"

api_port="${BPO_E2E_API_PORT:-8810}"
web_port="${BPO_E2E_WEB_PORT:-3310}"

for port in "$api_port" "$web_port"; do
  if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "port $port already in use; stop the process or override BPO_E2E_API_PORT/BPO_E2E_WEB_PORT" >&2
    exit 1
  fi
done

e2e_db="$(mktemp "${TMPDIR:-/tmp}/bpo-e2e.XXXXXX.db")"
export BPO_DATABASE_URL="sqlite:///${e2e_db}"
export NEXT_PUBLIC_BPO_API_BASE_URL="http://127.0.0.1:${api_port}"
export BPO_E2E_BASE_URL="http://127.0.0.1:${web_port}"

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

cleanup() {
  trap - INT TERM EXIT
  terminate_tree "${api_pid:-}"
  terminate_tree "${web_pid:-}"
  rm -f "$e2e_db"
}

trap cleanup INT TERM EXIT

"$backend_python" -m backend.app.review_demo_seed >/dev/null

echo "starting E2E API at ${NEXT_PUBLIC_BPO_API_BASE_URL}"
"$backend_python" -m uvicorn backend.app.main:app --host 127.0.0.1 --port "$api_port" &
api_pid=$!

echo "starting E2E frontend at ${BPO_E2E_BASE_URL}"
node_modules/.bin/next start --hostname 127.0.0.1 --port "$web_port" &
web_pid=$!

wait_for_url() {
  local url="$1"
  local name="$2"

  for _ in $(seq 1 60); do
    if curl -sf -o /dev/null "$url"; then
      return 0
    fi
    sleep 1
  done

  echo "$name did not become ready at $url" >&2
  return 1
}

wait_for_url "http://127.0.0.1:${api_port}/api/v1/review-cases" "backend API"
wait_for_url "${BPO_E2E_BASE_URL}/data-quality/review-cases" "frontend"

npx playwright test

echo "e2e passed"
