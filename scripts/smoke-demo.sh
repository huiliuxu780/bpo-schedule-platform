#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

backend_python="$(bash scripts/verify-backend-runtime.sh --print-path)"
web_url="${BPO_WEB_URL:-http://localhost:3000}"
api_base_url="${BPO_API_BASE_URL:-http://127.0.0.1:8000}"
health_url="${BPO_HEALTH_URL:-${api_base_url%/}/health}"
timeout_seconds="${BPO_SMOKE_TIMEOUT_SECONDS:-5}"

"$backend_python" - "$health_url" "$web_url" "$timeout_seconds" <<'PY'
import json
import sys
import urllib.error
import urllib.request

health_url = sys.argv[1]
web_url = sys.argv[2]
timeout = float(sys.argv[3])


def fetch(url: str) -> tuple[int, bytes, str]:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "bpo-schedule-platform-smoke/1.0"},
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            content_type = response.headers.get("content-type", "")
            return response.status, response.read(), content_type
    except urllib.error.URLError as exc:
        raise SystemExit(f"smoke failed: cannot reach {url}: {exc}") from exc


status, body, content_type = fetch(health_url)
if status != 200:
    raise SystemExit(f"smoke failed: health endpoint returned HTTP {status}")

try:
    payload = json.loads(body.decode("utf-8"))
except json.JSONDecodeError as exc:
    raise SystemExit(f"smoke failed: health endpoint did not return JSON: {exc}") from exc

expected = {"project": "bpo-schedule-platform", "status": "ok"}
for key, value in expected.items():
    if payload.get(key) != value:
        raise SystemExit(
            f"smoke failed: health endpoint expected {key}={value!r}, got {payload.get(key)!r}"
        )

status, body, content_type = fetch(web_url)
if status != 200:
    raise SystemExit(f"smoke failed: frontend returned HTTP {status}")

if "text/html" not in content_type:
    raise SystemExit(
        f"smoke failed: frontend content-type should include text/html, got {content_type!r}"
    )

print(f"backend health ok: {health_url}")
print(f"frontend reachable: {web_url}")
PY
