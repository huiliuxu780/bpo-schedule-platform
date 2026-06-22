#!/usr/bin/env bash
set -euo pipefail

if (( $# != 2 )); then
  echo "usage: bash harness-template/scripts/init-harness.sh <target-dir> <project-name>" >&2
  exit 2
fi

target_dir="$1"
project_name="$2"

template_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
files_root="$template_root/files"

if [[ ! -d "$files_root" ]]; then
  echo "missing template files directory: $files_root" >&2
  exit 1
fi

mkdir -p "$target_dir"
target_abs="$(cd "$target_dir" && pwd -P)"

while IFS= read -r source_file; do
  relative_path="${source_file#"$files_root"/}"
  output_path="$target_abs/${relative_path%.template}"
  mkdir -p "$(dirname "$output_path")"
  sed \
    -e "s|__PROJECT_NAME__|$project_name|g" \
    -e "s|__PROJECT_ROOT__|$target_abs|g" \
    "$source_file" > "$output_path"
done < <(find "$files_root" -type f | sort)

echo "Harness initialized at $target_abs for $project_name"
