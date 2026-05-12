#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

expected_python="${BPO_EXPECT_PYTHON_VERSION:-3.12}"
print_path=0
require_dev_deps=0

for arg in "$@"; do
  case "$arg" in
    --print-path)
      print_path=1
      ;;
    --require-dev-deps)
      require_dev_deps=1
      ;;
    *)
      echo "unknown argument: $arg" >&2
      exit 1
      ;;
  esac
done

required_modules=("fastapi" "pydantic")
if [[ "$require_dev_deps" == "1" ]]; then
  required_modules+=("uvicorn")
fi

join_by() {
  local delimiter="$1"
  shift
  local first=1
  for item in "$@"; do
    if [[ "$first" -eq 1 ]]; then
      printf '%s' "$item"
      first=0
    else
      printf '%s%s' "$delimiter" "$item"
    fi
  done
}

candidate_failure_messages=()
selected_python=""

validate_candidate() {
  local candidate="$1"
  local modules_csv="$2"

  "$candidate" - "$expected_python" "$modules_csv" <<'PY'
import importlib.util
import json
import sys

expected = sys.argv[1]
required = [name for name in sys.argv[2].split(",") if name]
version = ".".join(sys.version.split()[0].split(".")[:2])

if version != expected:
    print(
        json.dumps(
            {
                "status": "unsupported_version",
                "version": version,
                "expected": expected,
                "executable": sys.executable,
            }
        )
    )
    raise SystemExit(1)

missing = [name for name in required if importlib.util.find_spec(name) is None]
if missing:
    print(
        json.dumps(
            {
                "status": "missing_modules",
                "version": version,
                "missing": missing,
                "executable": sys.executable,
            }
        )
    )
    raise SystemExit(1)

print(
    json.dumps(
        {
            "status": "ok",
            "version": version,
            "executable": sys.executable,
        }
    )
)
PY
}

modules_csv="$(join_by "," "${required_modules[@]}")"

build_candidates() {
  local candidates=()

  if [[ -n "${BPO_BACKEND_PYTHON:-}" ]]; then
    candidates+=("$BPO_BACKEND_PYTHON")
  else
    candidates+=(
      "$ROOT_DIR/.venv/bin/python"
      "$ROOT_DIR/.venv/bin/python3"
    )

    if [[ -n "${BPO_PYTHON312_BIN:-}" ]]; then
      candidates+=("$BPO_PYTHON312_BIN")
    fi

    candidates+=(
      "/Users/mac/.local/bin/python3"
      "/opt/homebrew/bin/python3"
    )

    if command -v python3 >/dev/null 2>&1; then
      candidates+=("$(command -v python3)")
    fi

    candidates+=("/usr/bin/python3")
  fi

  printf '%s\n' "${candidates[@]}"
}

while IFS= read -r candidate; do
  [[ -n "$candidate" ]] || continue
  [[ -x "$candidate" ]] || continue

  output="$(validate_candidate "$candidate" "$modules_csv" 2>/dev/null || true)"
  if [[ -z "$output" ]]; then
    candidate_failure_messages+=("- $candidate failed to execute backend runtime validation")
    continue
  fi

  status="$("$candidate" - "$output" <<'PY'
import json
import sys
print(json.loads(sys.argv[1])["status"])
PY
)"

  if [[ "$status" == "ok" ]]; then
    selected_python="$candidate"
    break
  fi

  if [[ "$status" == "unsupported_version" ]]; then
    version="$("$candidate" - "$output" <<'PY'
import json
import sys
data = json.loads(sys.argv[1])
print(data["version"])
PY
)"
    candidate_failure_messages+=(
      "- unsupported backend runtime: expected Python $expected_python, got $version at $candidate"
    )
    continue
  fi

  if [[ "$status" == "missing_modules" ]]; then
    missing="$("$candidate" - "$output" <<'PY'
import json
import sys
data = json.loads(sys.argv[1])
print(",".join(data["missing"]))
PY
)"
    candidate_failure_messages+=(
      "- backend runtime missing required modules at $candidate: $missing"
    )
    continue
  fi

  candidate_failure_messages+=("- $candidate failed backend runtime validation")
done < <(build_candidates)

if [[ -z "$selected_python" ]]; then
  echo "backend runtime check failed" >&2
  for line in "${candidate_failure_messages[@]}"; do
    echo "$line" >&2
  done
  echo "" >&2
  echo "recommended fix:" >&2
  echo "- use a Python $expected_python interpreter for this project" >&2
  echo "- point BPO_BACKEND_PYTHON or BPO_PYTHON312_BIN to that interpreter if needed" >&2
  echo "- install backend dependencies with: <python-3.12> -m pip install -r backend/requirements.txt" >&2
  exit 1
fi

if [[ "$print_path" == "1" ]]; then
  printf '%s\n' "$selected_python"
  exit 0
fi

echo "backend runtime check passed on $("$selected_python" --version 2>&1) at $selected_python"
