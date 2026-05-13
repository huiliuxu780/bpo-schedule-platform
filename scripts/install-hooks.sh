#!/usr/bin/env bash
set -euo pipefail

git config core.hooksPath scripts/hooks
chmod +x scripts/hooks/pre-commit
chmod +x scripts/hooks/commit-msg
chmod +x scripts/hooks/pre-push
