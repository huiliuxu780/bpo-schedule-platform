from typing import Any

from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeBindingInput,
    EmployeeMasterDataInput,
    ImportBatchPersistenceDetail,
    ImportBatchRowResultRecord,
    MasterDataReferenceInput,
    MasterDataSnapshotRequest,
)


REFERENCE_RECORD_TYPES = {
    "supplier": ("suppliers", "supplier_id", "supplier_name"),
    "workplace": ("workplaces", "workplace_id", "workplace_name"),
    "project": ("projects", "project_id", "project_name"),
    "skill": ("skills", "skill_id", "skill_name"),
}


def apply_master_data_import_batch(
    detail: ImportBatchPersistenceDetail,
    repository: MasterDataPersistenceRepository,
) -> dict[str, int | str]:
    if detail.batch.file_type != "master_data":
        raise ValueError(
            f"batch {detail.batch.batch_id} file_type must be master_data, "
            f"got {detail.batch.file_type}"
        )

    snapshot = MasterDataSnapshotRequest(batch_id=detail.batch.batch_id)
    skipped_rows = 0

    for row in detail.rows:
        if row.row_status != "success":
            skipped_rows += 1
            continue
        _append_success_row(snapshot, row)

    applied_status = (
        "already_applied"
        if repository.has_snapshot_batch(detail.batch.batch_id)
        else "applied"
    )
    if applied_status == "applied":
        repository.create_snapshot(snapshot)

    return {
        "batch_id": detail.batch.batch_id,
        "applied_status": applied_status,
        "suppliers": len(snapshot.suppliers),
        "workplaces": len(snapshot.workplaces),
        "projects": len(snapshot.projects),
        "skills": len(snapshot.skills),
        "employees": len(snapshot.employees),
        "bindings": len(snapshot.bindings),
        "skipped_rows": skipped_rows,
    }


def _append_success_row(
    snapshot: MasterDataSnapshotRequest,
    row: ImportBatchRowResultRecord,
) -> None:
    fields = _standard_fields(row)
    record_type = _required_value(fields, row.row_number, "record_type")

    if record_type in REFERENCE_RECORD_TYPES:
        target_name, id_field, name_field = REFERENCE_RECORD_TYPES[record_type]
        getattr(snapshot, target_name).append(
            MasterDataReferenceInput(
                reference_id=_required_value(
                    fields,
                    row.row_number,
                    "reference_id",
                    id_field,
                ),
                reference_name=_required_value(
                    fields,
                    row.row_number,
                    "reference_name",
                    name_field,
                ),
                status=_required_value(fields, row.row_number, "status"),
                effective_from=_required_value(fields, row.row_number, "effective_from"),
                effective_to=_required_value(fields, row.row_number, "effective_to"),
            )
        )
        return

    if record_type == "employee":
        snapshot.employees.append(
            EmployeeMasterDataInput(
                employee_id=_required_value(fields, row.row_number, "employee_id"),
                employee_name=_required_value(fields, row.row_number, "employee_name"),
                status=_required_value(fields, row.row_number, "status"),
                effective_from=_required_value(fields, row.row_number, "effective_from"),
                effective_to=_required_value(fields, row.row_number, "effective_to"),
            )
        )
        return

    if record_type == "binding":
        snapshot.bindings.append(
            EmployeeBindingInput(
                binding_id=_required_value(fields, row.row_number, "binding_id"),
                employee_id=_required_value(fields, row.row_number, "employee_id"),
                supplier_id=_required_value(fields, row.row_number, "supplier_id"),
                workplace_id=_required_value(fields, row.row_number, "workplace_id"),
                project_id=_required_value(fields, row.row_number, "project_id"),
                skill_id=_required_value(fields, row.row_number, "skill_id"),
                effective_from=_required_value(fields, row.row_number, "effective_from"),
                effective_to=_required_value(fields, row.row_number, "effective_to"),
            )
        )
        return

    raise ValueError(
        f"row_number={row.row_number} has unknown record_type: {record_type}"
    )


def _standard_fields(row: ImportBatchRowResultRecord) -> dict[str, Any]:
    fields = row.raw_data.get("standard_fields")
    if not isinstance(fields, dict):
        raise ValueError(
            f"row_number={row.row_number} missing standard_fields"
        )
    return fields


def _required_value(
    fields: dict[str, Any],
    row_number: int,
    *field_names: str,
) -> str:
    for field_name in field_names:
        value = fields.get(field_name)
        if value is not None and str(value).strip():
            return str(value).strip()
    expected = " or ".join(field_names)
    raise ValueError(f"row_number={row_number} missing required field: {expected}")
