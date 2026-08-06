#!/usr/bin/env bash
# Verification gate: lint + typecheck + build + frontend model tests + backend tests + e2e behavioral check.
#
# Usage:
#   bash scripts/check.sh                     full run: all six layers (default)
#   bash scripts/check.sh --fast              skip next build and e2e, run the other four layers
#   bash scripts/check.sh --lint --typecheck  run only the selected layers
#
# Selectable layers: --model-tests --lint --typecheck --build --backend --e2e
# Layer flags can be combined freely; --fast cannot be combined with layer flags.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

usage() {
  cat <<'EOF'
usage: bash scripts/check.sh [--fast] [--model-tests] [--lint] [--typecheck] [--build] [--backend] [--e2e]

no arguments: run all six layers (frontend model tests, lint, typecheck, build, backend tests, e2e)
  --fast          skip the next build and e2e layers; cannot be combined with layer flags
  --model-tests   frontend model tests only (node --test scripts/tests/*.test.mjs)
  --lint          ESLint only (npm run lint)
  --typecheck     TypeScript typecheck only (npm run typecheck)
  --build         production build only (npm run build)
  --backend       backend unittest discovery only
  --e2e           Playwright behavioral check only (requires a prior production build)
  -h, --help      show this help
EOF
}

run_model_tests=0
run_lint=0
run_typecheck=0
run_build=0
run_backend=0
run_e2e=0
fast=0
layers_selected=0

for arg in "$@"; do
  case "$arg" in
    --fast) fast=1 ;;
    --model-tests) run_model_tests=1; layers_selected=1 ;;
    --lint) run_lint=1; layers_selected=1 ;;
    --typecheck) run_typecheck=1; layers_selected=1 ;;
    --build) run_build=1; layers_selected=1 ;;
    --backend) run_backend=1; layers_selected=1 ;;
    --e2e) run_e2e=1; layers_selected=1 ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "unknown option: $arg" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ "$fast" -eq 1 && "$layers_selected" -eq 1 ]]; then
  echo "invalid combination: --fast cannot be combined with layer flags" >&2
  usage >&2
  exit 2
fi

if [[ "$layers_selected" -eq 0 ]]; then
  run_model_tests=1
  run_lint=1
  run_typecheck=1
  run_backend=1
  if [[ "$fast" -eq 0 ]]; then
    run_build=1
    run_e2e=1
  fi
fi

needs_frontend=0
if [[ "$run_model_tests" -eq 1 || "$run_lint" -eq 1 || "$run_typecheck" -eq 1 || "$run_build" -eq 1 || "$run_e2e" -eq 1 ]]; then
  needs_frontend=1
fi

if [[ "$needs_frontend" -eq 1 ]]; then
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

  if [[ ! -x "node_modules/.bin/next" ]]; then
    echo "frontend dependencies missing: run npm install first" >&2
    exit 1
  fi
fi

backend_python=""
if [[ "$run_backend" -eq 1 ]]; then
  backend_python="$(bash scripts/verify-backend-runtime.sh --print-path)"
  echo "using backend Python $("$backend_python" -c 'import sys; print(sys.executable)')"
fi

if [[ "$run_model_tests" -eq 1 ]]; then
  # Frontend model tests (product structure + domain models, import .ts sources directly)
  echo "== frontend model tests =="
  node --experimental-strip-types --test scripts/tests/*.test.mjs
fi

if [[ "$run_lint" -eq 1 ]]; then
  echo "== lint =="
  npm run lint
fi

if [[ "$run_typecheck" -eq 1 ]]; then
  echo "== typecheck =="
  npm run typecheck
fi

if [[ "$run_build" -eq 1 ]]; then
  echo "== build =="
  npm run build
fi

if [[ "$run_backend" -eq 1 ]]; then
  echo "== backend tests =="
  "$backend_python" -m unittest discover -s backend/tests
fi

if [[ "$run_e2e" -eq 1 ]]; then
  # E2E behavioral check (Playwright, isolated servers on dedicated ports)
  echo "== e2e =="
  bash scripts/e2e.sh
fi

echo "check passed"
