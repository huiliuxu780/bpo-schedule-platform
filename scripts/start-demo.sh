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
  echo "demo startup failed: expected Node.js 22" >&2
  echo "install Homebrew node@22 or set BPO_NODE22_BIN to a directory containing node and npm" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "demo startup failed: npm was not found after selecting Node.js 22" >&2
  exit 1
fi

resolve_backend_python() {
  bash scripts/verify-backend-runtime.sh --require-dev-deps --print-path
}

backend_python="$(resolve_backend_python)"

api_host="${BPO_API_HOST:-127.0.0.1}"
api_port="${BPO_API_PORT:-8000}"
web_port="${BPO_WEB_PORT:-3000}"
web_url="${BPO_WEB_URL:-http://localhost:${web_port}}"
export BPO_API_BASE_URL="${BPO_API_BASE_URL:-http://${api_host}:${api_port}}"
health_url="${BPO_API_BASE_URL%/}/health"

api_pid=""
web_pid=""

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
  terminate_tree "$api_pid"
  terminate_tree "$web_pid"
}

trap cleanup INT TERM EXIT

echo "using Node.js $(node -v) at $(command -v node)"
echo "using backend Python $("$backend_python" -c 'import sys; print(sys.executable)')"
echo "starting backend API at ${BPO_API_BASE_URL}"
"$backend_python" -m uvicorn backend.app.main:app --host "$api_host" --port "$api_port" --reload &
api_pid=$!

echo "starting frontend at ${web_url}"
bash scripts/run-next-dev.sh --port "$web_port" &
web_pid=$!

cat <<EOF

Local demo is starting.
Frontend: ${web_url}
Backend:  ${BPO_API_BASE_URL}
Health:   ${health_url}
Smoke:    bash scripts/smoke-demo.sh

Press Ctrl-C to stop both processes.
EOF

exit_code=0

while true; do
  if ! kill -0 "$api_pid" 2>/dev/null; then
    wait "$api_pid" || exit_code=$?
    echo "backend API exited with code ${exit_code}" >&2
    break
  fi

  if ! kill -0 "$web_pid" 2>/dev/null; then
    wait "$web_pid" || exit_code=$?
    echo "frontend exited with code ${exit_code}" >&2
    break
  fi

  sleep 1
done

cleanup
exit "$exit_code"
