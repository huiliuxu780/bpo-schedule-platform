from typing import Any

from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeBindingInput,
    EmployeeMasterDataInput,
    EmployeeSkillInput,
    ImportBatchPersistenceDetail,
    ImportBatchRowResultRecord,
    MasterDataOrganizationInput,
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
        "organizations": len(snapshot.organizations),
        "employees": len(snapshot.employees),
        "employee_skills": len(snapshot.employee_skills),
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
                skill_category=_optional_value(fields, "skill_category")
                if record_type == "skill"
                else None,
            )
        )
        return

    if record_type == "organization":
        snapshot.organizations.append(
            MasterDataOrganizationInput(
                organization_id=_required_value(fields, row.row_number, "organization_id"),
                organization_name=_required_value(
                    fields,
                    row.row_number,
                    "organization_name",
                ),
                organization_level=_required_int(
                    fields,
                    row.row_number,
                    "organization_level",
                ),
                parent_organization_id=_optional_value(
                    fields,
                    "parent_organization_id",
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
                employee_type=_optional_value(fields, "employee_type") or "internal",
                organization_id=_optional_value(fields, "organization_id"),
                workplace_id=_optional_value(fields, "workplace_id"),
                effective_from=_required_value(fields, row.row_number, "effective_from"),
                effective_to=_required_value(fields, row.row_number, "effective_to"),
            )
        )
        return

    if record_type == "employee_skill":
        snapshot.employee_skills.append(
            EmployeeSkillInput(
                employee_id=_required_value(fields, row.row_number, "employee_id"),
                skill_id=_required_value(fields, row.row_number, "skill_id"),
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


def _optional_value(fields: dict[str, Any], field_name: str) -> str | None:
    value = fields.get(field_name)
    if value is None or not str(value).strip():
        return None
    return str(value).strip()


def _required_int(fields: dict[str, Any], row_number: int, field_name: str) -> int:
    value = _required_value(fields, row_number, field_name)
    try:
        return int(value)
    except ValueError as exc:
        raise ValueError(
            f"row_number={row_number} field {field_name} must be integer"
        ) from exc
