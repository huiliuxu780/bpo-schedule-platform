#!/usr/bin/env bash

run_check_step() {
  local label="$1"
  shift

  local output_mode="${BPO_CHECK_OUTPUT_MODE:-quiet}"

  case "$output_mode" in
    quiet)
      run_quiet_check_step "$label" "$@"
      ;;
    verbose)
      "$@"
      ;;
    *)
      echo "unsupported BPO_CHECK_OUTPUT_MODE: $output_mode" >&2
      echo "expected one of: quiet, verbose" >&2
      return 1
      ;;
  esac
}

run_quiet_check_step() {
  local label="$1"
  shift

  local output_file
  output_file="$(mktemp "${TMPDIR:-/tmp}/bpo-check-${label//[^A-Za-z0-9]/-}.XXXXXX")"

  if "$@" >"$output_file" 2>&1; then
    echo "PASS: $label"
    rm -f "$output_file"
    return 0
  else
    local status=$?
    echo "FAIL: $label" >&2
    echo "----- captured output: $label -----" >&2
    cat "$output_file" >&2
    echo "----- end captured output: $label -----" >&2
    rm -f "$output_file"
    return "$status"
  fi
}
