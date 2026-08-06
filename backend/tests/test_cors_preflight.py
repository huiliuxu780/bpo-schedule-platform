"""CORS preflight coverage for browser-origin write paths (e2e / local dev).

The venv has no HTTP client for starlette TestClient, so the ASGI app is
invoked directly with a crafted OPTIONS scope.
"""

import asyncio
import unittest

from backend.app.main import app

ALLOWED_ORIGIN = "http://127.0.0.1:3310"
WRITE_PATH = "/api/v1/schedule-periods/PERIOD-2026-06/matrix/batch"


def _run_preflight(origin: str, method: str = "PATCH", path: str = WRITE_PATH):
    scope = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "http_version": "1.1",
        "method": "OPTIONS",
        "scheme": "http",
        "path": path,
        "raw_path": path.encode("utf-8"),
        "query_string": b"",
        "root_path": "",
        "headers": [
            (b"host", b"127.0.0.1:8810"),
            (b"origin", origin.encode("utf-8")),
            (b"access-control-request-method", method.encode("utf-8")),
            (b"access-control-request-headers", b"content-type"),
        ],
        "client": ("127.0.0.1", 51234),
        "server": ("127.0.0.1", 8810),
    }

    async def receive():
        return {"type": "http.request", "body": b"", "more_body": False}

    sent: list[dict] = []

    async def send(message):
        sent.append(message)

    asyncio.run(app(scope, receive, send))

    start = next(message for message in sent if message["type"] == "http.response.start")
    headers = {
        key.decode("latin-1").lower(): value.decode("latin-1")
        for key, value in start["headers"]
    }
    return start["status"], headers


class CorsPreflightTests(unittest.TestCase):
    def test_preflight_from_local_frontend_origin_returns_200(self):
        status, headers = _run_preflight(ALLOWED_ORIGIN)

        self.assertEqual(status, 200)
        self.assertEqual(headers.get("access-control-allow-origin"), ALLOWED_ORIGIN)
        self.assertIn("PATCH", headers.get("access-control-allow-methods", ""))
        self.assertIn(
            "content-type", headers.get("access-control-allow-headers", "").lower()
        )

    def test_preflight_from_localhost_dev_origin_is_allowed(self):
        status, headers = _run_preflight(
            "http://localhost:3000", method="POST", path="/api/v1/schedule-periods"
        )

        self.assertEqual(status, 200)
        self.assertEqual(headers.get("access-control-allow-origin"), "http://localhost:3000")

    def test_preflight_from_unknown_origin_is_rejected(self):
        status, headers = _run_preflight("http://evil.example")

        self.assertNotEqual(status, 200)
        self.assertNotIn("access-control-allow-origin", headers)


if __name__ == "__main__":
    unittest.main()
