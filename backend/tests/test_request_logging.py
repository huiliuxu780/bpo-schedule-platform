import asyncio
import logging
import unittest
from unittest.mock import Mock

from backend.app.forecast_import import apply_forecast_import_batch
from backend.app.import_upload import build_import_batch_from_csv
from backend.app.main import app
from backend.app.models import (
    ImportBatchPersistenceDetail,
    ImportBatchRecord,
    ImportBatchVersionRecord,
)
from backend.app.request_logging import (
    REQUEST_ID_HEADER,
    RequestCorrelationMiddleware,
    RequestIdFilter,
    current_request_id,
)


def _http_scope(headers: list[tuple[bytes, bytes]] | None = None) -> dict:
    return {
        "type": "http",
        "method": "POST",
        "path": "/api/v1/import-batches/upload-csv",
        "headers": headers or [],
    }


async def _receive() -> dict:
    return {"type": "http.request", "body": b"", "more_body": False}


async def _send(message: dict) -> None:
    return None


class _ListHandler(logging.Handler):
    def __init__(self) -> None:
        super().__init__()
        self.records: list[logging.LogRecord] = []

    def emit(self, record: logging.LogRecord) -> None:
        self.records.append(record)


class RequestCorrelationMiddlewareTest(unittest.TestCase):
    def test_middleware_is_registered_on_app(self) -> None:
        middleware_classes = {middleware.cls for middleware in app.user_middleware}

        self.assertIn(RequestCorrelationMiddleware, middleware_classes)

    def test_generates_and_echoes_request_id(self) -> None:
        sent_messages: list[dict] = []
        observed_request_ids: list[str] = []

        async def downstream(scope, receive, send) -> None:
            observed_request_ids.append(current_request_id())
            await send({"type": "http.response.start", "status": 200, "headers": []})
            await send({"type": "http.response.body", "body": b"{}"})

        async def send(message: dict) -> None:
            sent_messages.append(message)

        middleware = RequestCorrelationMiddleware(downstream)

        asyncio.run(middleware(_http_scope(), _receive, send))

        response_start = sent_messages[0]
        echoed = dict(response_start["headers"])[REQUEST_ID_HEADER.encode("latin-1")]
        self.assertEqual(observed_request_ids, [echoed.decode("latin-1")])
        self.assertEqual(current_request_id(), "-")

    def test_reuses_inbound_request_id(self) -> None:
        sent_messages: list[dict] = []
        observed_request_ids: list[str] = []

        async def downstream(scope, receive, send) -> None:
            observed_request_ids.append(current_request_id())
            await send({"type": "http.response.start", "status": 200, "headers": []})
            await send({"type": "http.response.body", "body": b"{}"})

        async def send(message: dict) -> None:
            sent_messages.append(message)

        middleware = RequestCorrelationMiddleware(downstream)
        scope = _http_scope(headers=[(b"x-request-id", b"req-from-client-001")])

        asyncio.run(middleware(scope, _receive, send))

        self.assertEqual(observed_request_ids, ["req-from-client-001"])
        echoed = dict(sent_messages[0]["headers"])[b"x-request-id"]
        self.assertEqual(echoed, b"req-from-client-001")

    def test_non_http_scope_passes_through_without_request_id(self) -> None:
        observed_request_ids: list[str] = []

        async def downstream(scope, receive, send) -> None:
            observed_request_ids.append(current_request_id())

        middleware = RequestCorrelationMiddleware(downstream)

        asyncio.run(middleware({"type": "lifespan"}, _receive, _send))

        self.assertEqual(observed_request_ids, ["-"])

    def test_request_and_service_logs_share_one_request_id(self) -> None:
        handler = _ListHandler()
        handler.addFilter(RequestIdFilter())
        app_logger = logging.getLogger("backend.app")
        app_logger.addHandler(handler)
        self.addCleanup(app_logger.removeHandler, handler)

        async def downstream(scope, receive, send) -> None:
            build_import_batch_from_csv(
                batch_id="BATCH-REQLOG-001",
                file_name="employees.csv",
                file_type="master_data",
                uploaded_by="数据管理员",
                business_date_from="2026-05-11",
                business_date_to="2026-05-11",
                csv_text="员工编号,姓名\nA-1001,张三\n,李四\n",
                field_mapping={"员工编号": "source_key"},
            )
            await send({"type": "http.response.start", "status": 200, "headers": []})
            await send({"type": "http.response.body", "body": b"{}"})

        middleware = RequestCorrelationMiddleware(downstream)

        asyncio.run(middleware(_http_scope(), _receive, _send))

        row_failure_records = [
            record
            for record in handler.records
            if "import row validation failed" in record.getMessage()
        ]
        request_records = [
            record
            for record in handler.records
            if "request finished" in record.getMessage()
        ]
        self.assertEqual(len(row_failure_records), 1)
        self.assertEqual(len(request_records), 1)

        row_failure = row_failure_records[0]
        self.assertIn("batch_id=BATCH-REQLOG-001", row_failure.getMessage())
        self.assertIn("row_number=2", row_failure.getMessage())
        self.assertNotEqual(row_failure.request_id, "-")
        self.assertEqual(row_failure.request_id, request_records[0].request_id)


class ServiceDecisionLogTest(unittest.TestCase):
    def test_version_selection_log_contains_batch_id(self) -> None:
        detail = ImportBatchPersistenceDetail(
            batch=ImportBatchRecord(
                batch_id="BATCH-REQLOG-FCST",
                file_name="forecast.csv",
                file_type="demand_forecast",
                uploaded_by="排班专员",
                uploaded_at="2026-05-11T09:00:00",
                business_date_from="2026-05-11",
                business_date_to="2026-05-11",
                processing_status="completed",
                total_rows=0,
                success_rows=0,
                failed_rows=0,
                warning_rows=0,
            ),
            rows=[],
            failed_rows=[],
            versions=[
                ImportBatchVersionRecord(
                    version_id="BATCH-REQLOG-FCST::v1",
                    batch_id="BATCH-REQLOG-FCST",
                    version_type="demand_forecast",
                    business_date_from="2026-05-11",
                    business_date_to="2026-05-11",
                    created_at="2026-05-11T09:00:00",
                )
            ],
        )
        repository = Mock()
        repository.has_forecast_import_version.return_value = True

        with self.assertLogs("backend.app.forecast_import", level="INFO") as captured:
            summary = apply_forecast_import_batch(detail, repository)

        self.assertEqual(summary["applied_status"], "already_applied")
        selection_records = [
            record
            for record in captured.records
            if "import version selected" in record.getMessage()
        ]
        self.assertEqual(len(selection_records), 1)
        message = selection_records[0].getMessage()
        self.assertIn("batch_id=BATCH-REQLOG-FCST", message)
        self.assertIn("version_id=BATCH-REQLOG-FCST::v1", message)

    def test_request_id_filter_defaults_to_dash_outside_request(self) -> None:
        record = logging.LogRecord(
            name="backend.app.test",
            level=logging.INFO,
            pathname=__file__,
            lineno=1,
            msg="hello",
            args=(),
            exc_info=None,
        )

        RequestIdFilter().filter(record)

        self.assertEqual(record.request_id, "-")


if __name__ == "__main__":
    unittest.main()
