#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

required_files=(
  "AGENTS.md"
  "docs/PROJECT_STATE.md"
  "docs/quality/GATE_REGISTRY.md"
  "docs/quality/GATE_PLAN_TEMPLATE.md"
  "docs/quality/DONE_REPORT_TEMPLATE.md"
  "docs/dev/branch-log.md"
  "tasks/backlog.yaml"
  ".gitignore"
  "README.md"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "missing required Harness file: $file" >&2
    exit 1
  fi
done

for forbidden in frontend backend pnpm-lock.yaml yarn.lock; do
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

echo "frontend scaffold Harness check passed"
