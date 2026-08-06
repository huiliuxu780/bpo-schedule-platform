"""Request correlation logging for the FastAPI backend (stdlib only).

A pure ASGI middleware assigns one correlation id per HTTP request and stores
it in a contextvar, so service-layer log lines emitted while handling that
request carry the same ``request_id`` as the request log line.
"""

import contextvars
import logging
import uuid
from collections.abc import Awaitable, Callable, MutableMapping
from typing import Any

REQUEST_ID_HEADER = "x-request-id"
_MAX_INBOUND_REQUEST_ID_LENGTH = 64

_request_id_var: contextvars.ContextVar[str | None] = contextvars.ContextVar(
    "backend_request_id",
    default=None,
)

logger = logging.getLogger(__name__)


def current_request_id() -> str:
    """Return the correlation id of the in-flight request, or ``-`` outside one."""
    return _request_id_var.get() or "-"


class RequestIdFilter(logging.Filter):
    """Inject the current correlation id into every emitted log record."""

    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = current_request_id()
        return True


class RequestCorrelationMiddleware:
    """Pure ASGI middleware that generates and propagates a request id.

    The id is reused from an inbound ``X-Request-ID`` header when present,
    echoed back on the response, and kept in a contextvar so downstream
    service-layer logs share the same identifier.
    """

    def __init__(
        self,
        app: Callable[
            [MutableMapping[str, Any], Callable, Callable],
            Awaitable[None],
        ],
    ) -> None:
        self.app = app

    async def __call__(self, scope, receive, send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        request_id = _resolve_request_id(scope)
        token = _request_id_var.set(request_id)
        status_code: int | None = None

        async def send_with_request_id(message) -> None:
            nonlocal status_code
            if message["type"] == "http.response.start":
                status_code = message["status"]
                headers = message.setdefault("headers", [])
                headers.append(
                    (REQUEST_ID_HEADER.encode("latin-1"), request_id.encode("latin-1"))
                )
            await send(message)

        try:
            await self.app(scope, receive, send_with_request_id)
        finally:
            logger.info(
                "request finished method=%s path=%s status=%s",
                scope["method"],
                scope["path"],
                status_code if status_code is not None else "-",
            )
            _request_id_var.reset(token)


def _resolve_request_id(scope) -> str:
    headers = dict(scope.get("headers") or [])
    inbound = headers.get(REQUEST_ID_HEADER.encode("latin-1"), b"").decode("latin-1")
    inbound = inbound.strip()[:_MAX_INBOUND_REQUEST_ID_LENGTH]
    return inbound or uuid.uuid4().hex[:12]


def configure_request_logging() -> None:
    """Attach a stderr handler with the request-id filter to ``backend.app``.

    Idempotent: uvicorn does not configure the ``backend.app`` logger, so the
    app owns one handler whose formatter always renders ``request_id=...``.
    """

    app_logger = logging.getLogger("backend.app")
    if any(
        getattr(handler, "_bpo_request_logging", False)
        for handler in app_logger.handlers
    ):
        return

    handler = logging.StreamHandler()
    handler.setFormatter(
        logging.Formatter(
            "%(asctime)s %(levelname)s %(name)s request_id=%(request_id)s %(message)s"
        )
    )
    handler.addFilter(RequestIdFilter())
    handler._bpo_request_logging = True  # type: ignore[attr-defined]
    app_logger.addHandler(handler)
    app_logger.setLevel(logging.INFO)
