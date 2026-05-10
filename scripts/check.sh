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

for forbidden in frontend backend package.json package-lock.json pnpm-lock.yaml yarn.lock; do
  if [[ -e "$forbidden" ]]; then
    echo "clean Harness violation: $forbidden exists" >&2
    exit 1
  fi
done

if find . -path ./.git -prune -o -name node_modules -print | grep -q .; then
  echo "clean Harness violation: node_modules exists" >&2
  exit 1
fi

echo "clean Harness check passed"
