import csv
from datetime import datetime, timedelta, timezone
from io import StringIO

from backend.app.models import (
    DemoImportBatchListResponse,
    DemoImportBatchSummary,
    DemoImportKind,
    DemoImportRecordListResponse,
    DemoImportRecordSummary,
    DemoImportResponse,
    DemoImportRowError,
)

REQUIRED_COLUMNS: dict[DemoImportKind, list[str]] = {
    "staff_master": ["staff_id", "name", "team", "site", "vendor", "role", "status"],
    "status_log": ["staff_id", "date", "start_time", "end_time", "status"],
    "login_log": [
        "staff_id",
        "date",
        "planned_login",
        "actual_login",
        "actual_logout",
        "online_minutes",
    ],
}

SOURCE_NAMES: dict[DemoImportKind, str] = {
    "staff_master": "坐席主数据",
    "status_log": "坐席状态数据",
    "login_log": "登录数据",
}

_batches: list[DemoImportBatchSummary] = []
_batch_rows: dict[str, list[dict[str, str]]] = {}


def clear_demo_import_state() -> None:
    _batches.clear()
    _batch_rows.clear()


def _now_iso() -> str:
    return datetime.now(timezone(timedelta(hours=8))).replace(microsecond=0).isoformat()


def _batch_id(kind: DemoImportKind) -> str:
    date_part = datetime.now(timezone(timedelta(hours=8))).strftime("%Y%m%d%H%M%S")
    sequence = sum(1 for batch in _batches if batch.kind == kind) + 1
    return f"{kind}-{date_part}-{sequence:03d}"


def _validate_header(kind: DemoImportKind, fieldnames: list[str] | None) -> list[str]:
    actual = {field.strip() for field in fieldnames or []}
    return [column for column in REQUIRED_COLUMNS[kind] if column not in actual]


def import_demo_csv(kind: DemoImportKind, csv_text: str) -> DemoImportResponse:
    reader = csv.DictReader(StringIO(csv_text.strip()))
    missing_columns = _validate_header(kind, reader.fieldnames)
    errors: list[DemoImportRowError] = []
    rows: list[dict[str, str]] = []

    if missing_columns:
        errors.append(
            DemoImportRowError(
                row_number=1,
                message=f"缺少必填列：{', '.join(missing_columns)}",
            )
        )
    else:
        for index, raw_row in enumerate(reader, start=2):
            row = {
                key.strip(): (value or "").strip()
                for key, value in raw_row.items()
                if key is not None
            }
            missing_values = [
                column for column in REQUIRED_COLUMNS[kind] if not row.get(column)
            ]

            if missing_values:
                errors.append(
                    DemoImportRowError(
                        row_number=index,
                        message=f"必填字段为空：{', '.join(missing_values)}",
                    )
                )
                continue

            rows.append(row)

    batch = DemoImportBatchSummary(
        batch_id=_batch_id(kind),
        kind=kind,
        source_name=SOURCE_NAMES[kind],
        status="needs_attention" if errors else "imported",
        success_rows=len(rows),
        failed_rows=len(errors),
        imported_at=_now_iso(),
    )
    _batches.insert(0, batch)
    _batch_rows[batch.batch_id] = rows

    return DemoImportResponse(batch=batch, errors=errors)


def list_demo_import_batches() -> DemoImportBatchListResponse:
    return DemoImportBatchListResponse(items=list(_batches))


def list_demo_import_records() -> DemoImportRecordListResponse:
    items: list[DemoImportRecordSummary] = []

    for kind, source_name in SOURCE_NAMES.items():
        kind_batches = [batch for batch in _batches if batch.kind == kind]
        if not kind_batches:
            continue

        latest_batch = kind_batches[0]
        rows = [
            row
            for batch in kind_batches
            for row in _batch_rows.get(batch.batch_id, [])
        ]

        items.append(
            DemoImportRecordSummary(
                kind=kind,
                source_name=source_name,
                total_rows=len(rows),
                latest_batch_id=latest_batch.batch_id,
                updated_at=latest_batch.imported_at,
                sample_rows=rows[:3],
            )
        )

    return DemoImportRecordListResponse(items=items)
