import csv
import logging
from io import StringIO

from backend.app.models import (
    ImportBatchCreateRequest,
    ImportBatchRowResultInput,
    ImportBatchVersionInput,
    ImportFileType,
)


logger = logging.getLogger(__name__)

REQUIRED_FIELD_MISSING = "REQUIRED_FIELD_MISSING"


def build_import_batch_from_csv(
    *,
    batch_id: str,
    file_name: str,
    file_type: ImportFileType,
    uploaded_by: str,
    business_date_from: str,
    business_date_to: str,
    csv_text: str,
    field_mapping: dict[str, str],
    version_id: str | None = None,
) -> ImportBatchCreateRequest:
    rows = _parse_csv_rows(csv_text, field_mapping)
    batch_version_id = version_id or f"{batch_id}::v1"

    return ImportBatchCreateRequest(
        batch_id=batch_id,
        file_name=file_name,
        file_type=file_type,
        uploaded_by=uploaded_by,
        business_date_from=business_date_from,
        business_date_to=business_date_to,
        rows=[
            _build_row_result(
                batch_id=batch_id,
                row_number=row_number,
                original_columns=original_columns,
                field_mapping=field_mapping,
            )
            for row_number, original_columns in enumerate(rows, start=1)
        ],
        versions=[
            ImportBatchVersionInput(
                version_id=batch_version_id,
                version_type=file_type,
                business_date_from=business_date_from,
                business_date_to=business_date_to,
            )
        ],
    )


def _parse_csv_rows(
    csv_text: str,
    field_mapping: dict[str, str],
) -> list[dict[str, str]]:
    if not csv_text or not csv_text.strip():
        raise ValueError("CSV 内容为空或缺少表头")

    reader = csv.DictReader(StringIO(csv_text))
    if not reader.fieldnames or not any(
        (field or "").strip() for field in reader.fieldnames
    ):
        raise ValueError("CSV 内容为空或缺少表头")

    header_names = {(field or "").strip() for field in reader.fieldnames}
    missing_source_columns = [
        source for source in field_mapping if source not in header_names
    ]
    if missing_source_columns:
        raise ValueError(
            f"CSV 表头缺少字段映射中的源列: {', '.join(missing_source_columns)}"
        )

    rows = [
        _normalize_original_columns(row)
        for row in reader
        if _has_row_content(row)
    ]
    if not rows:
        raise ValueError("CSV 至少需要一行数据")

    return rows


def _build_row_result(
    *,
    batch_id: str,
    row_number: int,
    original_columns: dict[str, str],
    field_mapping: dict[str, str],
) -> ImportBatchRowResultInput:
    standard_fields = {
        target_field: _normalize_cell(original_columns.get(source_column))
        for source_column, target_field in field_mapping.items()
    }
    source_key = standard_fields.get("source_key") or None
    raw_data = {
        "standard_fields": standard_fields,
        "original_columns": original_columns,
    }

    if source_key is None:
        logger.warning(
            "import row validation failed batch_id=%s row_number=%s "
            "error_field=source_key error_code=%s",
            batch_id,
            row_number,
            REQUIRED_FIELD_MISSING,
        )
        return ImportBatchRowResultInput(
            row_number=row_number,
            row_status="failed",
            source_key=None,
            error_field="source_key",
            error_code=REQUIRED_FIELD_MISSING,
            error_message="缺少必填字段 source_key",
            raw_data=raw_data,
        )

    return ImportBatchRowResultInput(
        row_number=row_number,
        row_status="success",
        source_key=source_key,
        raw_data=raw_data,
    )


def _has_row_content(row: dict[str, str | None]) -> bool:
    return any(_normalize_cell(value) for key, value in row.items() if key is not None)


def _normalize_original_columns(row: dict[str, str | None]) -> dict[str, str]:
    return {
        str(key).strip(): _normalize_cell(value)
        for key, value in row.items()
        if key is not None
    }


def _normalize_cell(value: str | None) -> str:
    return (value or "").strip()
