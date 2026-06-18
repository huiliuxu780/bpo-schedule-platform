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
  "scripts/check-shadcn-ui.mjs"
  "scripts/shadcn-ui-baseline.json"
  "scripts/verify-backend-runtime.sh"
  "scripts/verify-frontend-native-runtime.mjs"
  "scripts/tests/check-shadcn-ui.test.mjs"
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

npm run verify:dev-runtime
npm run test:dev-runtime
state_check_mode="${BPO_STATE_CHECK_MODE:-strict}"
case "$state_check_mode" in
  strict)
    bash scripts/check-state.sh --strict
    ;;
  repair-scope)
    bash scripts/check-state.sh --repair-scope
    ;;
  warning)
    bash scripts/check-state.sh
    ;;
  *)
    echo "unsupported BPO_STATE_CHECK_MODE: $state_check_mode" >&2
    echo "expected one of: strict, repair-scope, warning" >&2
    exit 1
    ;;
esac
node --test scripts/tests/check-state.test.mjs
node --test scripts/tests/check-shadcn-ui.test.mjs
node --test scripts/tests/import-center-format-url-model.test.mjs
node --test scripts/tests/import-center-batch-list-model.test.mjs
node --test scripts/tests/import-center-result-trace-model.test.mjs
node --test scripts/tests/import-center-comparison-model.test.mjs
node --test scripts/tests/import-center-exception-model.test.mjs
node --test scripts/tests/import-center-review-case-model.test.mjs
node --test scripts/tests/import-center-review-case-workspace-list-model.test.mjs
node --test scripts/tests/import-center-review-case-workspace-owner-model.test.mjs
node --test scripts/tests/import-center-review-case-workspace-grouping-model.test.mjs
node --test scripts/tests/import-center-review-case-detail-model.test.mjs
node --test scripts/tests/import-center-review-case-action-deck-model.test.mjs
node --test scripts/tests/import-center-review-case-action-write-model.test.mjs
node --test scripts/tests/import-center-version-workbench-model.test.mjs
node --test scripts/tests/import-center-version-action-model.test.mjs
node --test scripts/tests/import-center-version-comparison-model.test.mjs
node --test scripts/tests/import-center-batch-apply-model.test.mjs
node --test scripts/tests/import-center-template-model.test.mjs
node --test scripts/tests/import-center-upload-model.test.mjs
node --test scripts/tests/import-center-batch-detail-model.test.mjs
node --test scripts/tests/import-center-model-first-split.test.mjs
node --test scripts/tests/import-center-summary-split.test.mjs
node --test scripts/tests/master-data-maintenance-model.test.mjs
node --test scripts/tests/master-data-maintenance-agent-model.test.mjs
node --test scripts/tests/master-data-maintenance-reference-model.test.mjs
node --test scripts/tests/master-data-maintenance-workplace-detail-model.test.mjs
node --test scripts/tests/master-data-maintenance-service-team-detail-model.test.mjs
node --test scripts/tests/master-data-maintenance-vendor-detail-model.test.mjs
node --test scripts/tests/master-data-maintenance-workplace-payload-model.test.mjs
node --test scripts/tests/master-data-model-split.test.mjs
node --test scripts/tests/master-data-workbench-split.test.mjs
node --test scripts/tests/actual-log-production-workbench-model.test.mjs
node --test scripts/tests/actual-log-production-detail-status-model.test.mjs
node --test scripts/tests/actual-log-production-detail-login-model.test.mjs
node --test scripts/tests/personnel-schedule-production-workbench-model.test.mjs
node --test scripts/tests/personnel-schedule-production-detail-model.test.mjs
node --test scripts/tests/personnel-schedule-production-reference-blocker-model.test.mjs
node --test scripts/tests/demand-forecast-production-workbench-model.test.mjs
node --test scripts/tests/demand-forecast-production-detail-model.test.mjs
node --test scripts/tests/demand-forecast-production-change-trace-model.test.mjs
node --test scripts/tests/product-structure-app-shell.test.mjs
node --test scripts/tests/product-structure-master-data.test.mjs
node scripts/check-shadcn-ui.mjs
bash scripts/verify-backend-runtime.sh
node --test scripts/tests/verify-backend-runtime.test.mjs
npm run lint
npm run typecheck
npm run build

bash -n scripts/dev.sh
bash -n scripts/run-next-dev.sh
bash -n scripts/check-state.sh
bash -n scripts/verify-backend-runtime.sh

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

"$backend_python" -m unittest discover -s backend/tests -v

echo "project Harness check passed"
