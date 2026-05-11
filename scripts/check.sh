#!/usr/bin/env bash
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
  else
    echo "unsupported Node.js runtime: expected Node.js 22" >&2
    if command -v node >/dev/null 2>&1; then
      echo "current node: $(node -v) at $(command -v node)" >&2
    else
      echo "current node: not found" >&2
    fi
    echo "install Homebrew node@22 or set BPO_NODE22_BIN to a directory containing node and npm" >&2
    exit 1
  fi
fi

if [[ "$node_major" != "22" ]]; then
  echo "unsupported Node.js runtime after PATH setup: expected Node.js 22" >&2
  echo "current node: $(node -v 2>/dev/null || echo not-found) at $(command -v node 2>/dev/null || echo not-found)" >&2
  exit 1
fi

echo "using Node.js $(node -v) at $(command -v node)"

required_files=(
  ".node-version"
  ".nvmrc"
  "AGENTS.md"
  "docs/dev/setup.md"
  "docs/PROJECT_STATE.md"
  "docs/quality/GATE_REGISTRY.md"
  "docs/quality/GATE_PLAN_TEMPLATE.md"
  "docs/quality/DONE_REPORT_TEMPLATE.md"
  "docs/dev/branch-log.md"
  "tasks/backlog.yaml"
  "scripts/dev.sh"
  ".gitignore"
  "README.md"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "missing required Harness file: $file" >&2
    exit 1
  fi
done

for forbidden in frontend pnpm-lock.yaml yarn.lock; do
  if [[ -e "$forbidden" ]]; then
    echo "project boundary violation: $forbidden exists" >&2
    exit 1
  fi
done

frontend_files=(
  "package.json"
  "app/dashboard/page.tsx"
  "app/dashboard/data.ts"
  "components/app-sidebar.tsx"
  "components/site-header.tsx"
  "components/section-cards.tsx"
  "components/chart-area-interactive.tsx"
  "components/data-table.tsx"
  "components/bpo-heatmap.tsx"
  "components/data-sync-status.tsx"
  "components/theme-toggle.tsx"
)

for file in "${frontend_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "missing frontend scaffold file: $file" >&2
    exit 1
  fi
done

if ! grep -q "F001" tasks/backlog.yaml; then
  echo "missing F001 backlog entry" >&2
  exit 1
fi

if ! grep -q "Frontend dashboard scaffold" docs/PROJECT_STATE.md; then
  echo "project state was not updated for frontend dashboard scaffold" >&2
  exit 1
fi

missing_tools=()
for tool in eslint tsc next; do
  if [[ ! -x "node_modules/.bin/$tool" ]]; then
    missing_tools+=("$tool")
  fi
done

if (( ${#missing_tools[@]} > 0 )); then
  echo "frontend toolchain missing: ${missing_tools[*]}" >&2
  echo "run dependency installation under a confirmed dependency/install Gate before coding verification" >&2
  exit 1
fi

npm run lint
npm run typecheck
npm run build

bash -n scripts/dev.sh

backend_files=(
  "backend/app/main.py"
  "backend/app/models.py"
  "backend/app/repository.py"
  "backend/app/seed_data.py"
  "backend/tests/test_schedule_plans.py"
)

for file in "${backend_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "missing backend vertical file: $file" >&2
    exit 1
  fi
done

python3 - <<'PY'
import importlib.util
import sys

missing = [
    name
    for name in ("fastapi", "pydantic")
    if importlib.util.find_spec(name) is None
]

if missing:
    print(f"backend toolchain missing: {' '.join(missing)}", file=sys.stderr)
    print("install backend dependencies under a confirmed backend dependency Gate", file=sys.stderr)
    raise SystemExit(1)
PY

python3 -m unittest discover -s backend/tests -v

echo "project Harness check passed"
