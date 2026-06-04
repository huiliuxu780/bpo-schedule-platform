from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeMasterDataInput,
    MasterDataEmployeeMaintenanceRequest,
    MasterDataEmployeeMaintenanceResponse,
    MasterDataEmployeeRecord,
    MasterDataStatus,
)


def maintain_employee(
    employee_id: str,
    request: MasterDataEmployeeMaintenanceRequest,
    repository: MasterDataPersistenceRepository,
) -> MasterDataEmployeeMaintenanceResponse:
    if not repository.has_import_batch(request.source_batch_id):
        raise ValueError(f"SOURCE_BATCH_NOT_FOUND: {request.source_batch_id}")

    if request.action == "create":
        return _create_employee(employee_id, request, repository)

    existing = repository.get_employee(employee_id)
    if existing is None:
        raise ValueError(f"EMPLOYEE_NOT_FOUND: {employee_id}")

    if request.action == "freeze":
        employee = repository.upsert_employee(
            EmployeeMasterDataInput(
                employee_id=existing.employee_id,
                employee_name=existing.employee_name,
                status="frozen",
                effective_from=existing.effective_from,
                effective_to=existing.effective_to,
            ),
            request.source_batch_id,
        )
        return _response(employee_id, "frozen", employee)

    if request.action == "effective_period":
        _require_fields(request, "effective_from", "effective_to")
        _validate_effective_period(request.effective_from, request.effective_to)
        employee = repository.upsert_employee(
            EmployeeMasterDataInput(
                employee_id=existing.employee_id,
                employee_name=existing.employee_name,
                status=existing.status,
                effective_from=request.effective_from,
                effective_to=request.effective_to,
            ),
            request.source_batch_id,
        )
        return _response(employee_id, "effective_period_updated", employee)

    employee = repository.upsert_employee(
        EmployeeMasterDataInput(
            employee_id=existing.employee_id,
            employee_name=request.employee_name or existing.employee_name,
            status=request.status or existing.status,
            effective_from=request.effective_from or existing.effective_from,
            effective_to=request.effective_to or existing.effective_to,
        ),
        request.source_batch_id,
    )
    return _response(employee_id, "updated", employee)


def _create_employee(
    employee_id: str,
    request: MasterDataEmployeeMaintenanceRequest,
    repository: MasterDataPersistenceRepository,
) -> MasterDataEmployeeMaintenanceResponse:
    if repository.get_employee(employee_id) is not None:
        raise ValueError(f"EMPLOYEE_ALREADY_EXISTS: {employee_id}")
    _require_fields(request, "employee_name", "effective_from", "effective_to")
    _validate_effective_period(request.effective_from, request.effective_to)

    employee = repository.upsert_employee(
        EmployeeMasterDataInput(
            employee_id=employee_id,
            employee_name=request.employee_name,
            status=request.status or "active",
            effective_from=request.effective_from,
            effective_to=request.effective_to,
        ),
        request.source_batch_id,
    )
    return _response(employee_id, "created", employee)


def _require_fields(
    request: MasterDataEmployeeMaintenanceRequest,
    *field_names: str,
) -> None:
    missing = [
        field_name
        for field_name in field_names
        if getattr(request, field_name) in (None, "")
    ]
    if missing:
        raise ValueError(f"MISSING_REQUIRED_FIELD: {','.join(missing)}")


def _validate_effective_period(
    effective_from: str | None,
    effective_to: str | None,
) -> None:
    if effective_from is not None and effective_to is not None and effective_from > effective_to:
        raise ValueError("INVALID_EFFECTIVE_PERIOD: effective_from is after effective_to")


def _response(
    employee_id: str,
    action_status: str,
    employee: MasterDataEmployeeRecord,
) -> MasterDataEmployeeMaintenanceResponse:
    return MasterDataEmployeeMaintenanceResponse(
        employee_id=employee_id,
        action_status=action_status,
        employee=employee,
    )
