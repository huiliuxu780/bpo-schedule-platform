#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

source scripts/check-output.sh

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

resolve_backend_python() {
  bash scripts/verify-backend-runtime.sh --print-path
}

backend_python="$(resolve_backend_python)"
echo "using backend Python $("$backend_python" -c 'import sys; print(sys.executable)')"

required_files=(
  ".node-version"
  ".nvmrc"
  ".python-version"
  "AGENTS.md"
  "docs/dev/setup.md"
  "docs/PROJECT_STATE.md"
  "docs/quality/GATE_REGISTRY.md"
  "docs/quality/GATE_PLAN_TEMPLATE.md"
  "docs/quality/DONE_REPORT_TEMPLATE.md"
  "docs/dev/branch-log.md"
  "tasks/backlog.yaml"
  "scripts/dev.sh"
  "scripts/run-next-dev.sh"
  "scripts/check-state.sh"
  "scripts/check-output.sh"
  "scripts/check-shadcn-ui.mjs"
  "scripts/shadcn-ui-baseline.json"
  "scripts/verify-backend-runtime.sh"
  "scripts/verify-frontend-native-runtime.mjs"
  "scripts/tests/check-shadcn-ui.test.mjs"
  "scripts/tests/check-output.test.mjs"
  "scripts/tests/check-state.test.mjs"
  "scripts/tests/verify-backend-runtime.test.mjs"
  "scripts/tests/verify-frontend-native-runtime.test.mjs"
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

run_check_step "frontend runtime verifier" npm run verify:dev-runtime
run_check_step "frontend runtime tests" npm run test:dev-runtime
state_check_mode="${BPO_STATE_CHECK_MODE:-strict}"
case "$state_check_mode" in
  strict)
    run_check_step "state check strict" bash scripts/check-state.sh --strict
    ;;
  repair-scope)
    run_check_step "state check repair scope" bash scripts/check-state.sh --repair-scope
    ;;
  warning)
    run_check_step "state check warning" bash scripts/check-state.sh
    ;;
  *)
    echo "unsupported BPO_STATE_CHECK_MODE: $state_check_mode" >&2
    echo "expected one of: strict, repair-scope, warning" >&2
    exit 1
    ;;
esac
run_check_step "state check regression tests" node --test scripts/tests/check-state.test.mjs
run_check_step "check output regression tests" node --test scripts/tests/check-output.test.mjs
run_check_step "shadcn convention regression tests" node --test scripts/tests/check-shadcn-ui.test.mjs
run_check_step "shadcn convention scan" node scripts/check-shadcn-ui.mjs
run_check_step "backend runtime verifier" bash scripts/verify-backend-runtime.sh
run_check_step "backend runtime tests" node --test scripts/tests/verify-backend-runtime.test.mjs
run_check_step "frontend lint" npm run lint
run_check_step "frontend typecheck" npm run typecheck
run_check_step "frontend production build" npm run build

run_check_step "shell syntax checks" bash -lc 'bash -n scripts/dev.sh && bash -n scripts/run-next-dev.sh && bash -n scripts/check-state.sh && bash -n scripts/check-output.sh && bash -n scripts/verify-backend-runtime.sh'

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

run_check_step "backend unittest discovery" "$backend_python" -m unittest discover -s backend/tests -v

echo "project Harness check passed"
