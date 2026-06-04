from backend.app.master_data_persistence import MasterDataPersistenceRepository
from backend.app.models import (
    EmployeeBindingInput,
    EmployeeMasterDataInput,
    MasterDataBindingMaintenanceRequest,
    MasterDataBindingMaintenanceResponse,
    MasterDataEmployeeMaintenanceRequest,
    MasterDataEmployeeMaintenanceResponse,
    MasterDataEmployeeRecord,
    MasterDataReferenceInput,
    MasterDataReferenceMaintenanceRequest,
    MasterDataReferenceMaintenanceResponse,
    MasterDataReferenceRecord,
    MasterDataReferenceType,
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
                employee_type=existing.employee_type,
                organization_id=existing.organization_id,
                workplace_id=existing.workplace_id,
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
                employee_type=existing.employee_type,
                organization_id=existing.organization_id,
                workplace_id=existing.workplace_id,
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
            employee_type=request.employee_type or existing.employee_type,
            organization_id=request.organization_id or existing.organization_id,
            workplace_id=request.workplace_id or existing.workplace_id,
            effective_from=request.effective_from or existing.effective_from,
            effective_to=request.effective_to or existing.effective_to,
        ),
        request.source_batch_id,
    )
    return _response(employee_id, "updated", employee)


def maintain_reference(
    reference_type: MasterDataReferenceType,
    reference_id: str,
    request: MasterDataReferenceMaintenanceRequest,
    repository: MasterDataPersistenceRepository,
) -> MasterDataReferenceMaintenanceResponse:
    if not repository.has_import_batch(request.source_batch_id):
        raise ValueError(f"SOURCE_BATCH_NOT_FOUND: {request.source_batch_id}")

    if request.action == "create":
        return _create_reference(reference_type, reference_id, request, repository)

    existing = repository.get_reference(reference_type, reference_id)
    if existing is None:
        raise ValueError(f"REFERENCE_NOT_FOUND: {reference_type}/{reference_id}")

    if request.action == "freeze":
        reference = repository.upsert_reference(
            reference_type,
            MasterDataReferenceInput(
                reference_id=existing.reference_id,
                reference_name=existing.reference_name,
                status="frozen",
                effective_from=existing.effective_from,
                effective_to=existing.effective_to,
            ),
            request.source_batch_id,
        )
        return _reference_response(reference_type, reference_id, "frozen", reference)

    if request.action == "effective_period":
        _require_reference_fields(request, "effective_from", "effective_to")
        _validate_effective_period(request.effective_from, request.effective_to)
        reference = repository.upsert_reference(
            reference_type,
            MasterDataReferenceInput(
                reference_id=existing.reference_id,
                reference_name=existing.reference_name,
                status=existing.status,
                effective_from=request.effective_from,
                effective_to=request.effective_to,
            ),
            request.source_batch_id,
        )
        return _reference_response(
            reference_type,
            reference_id,
            "effective_period_updated",
            reference,
        )

    reference = repository.upsert_reference(
        reference_type,
        MasterDataReferenceInput(
            reference_id=existing.reference_id,
            reference_name=request.reference_name or existing.reference_name,
            status=request.status or existing.status,
            effective_from=request.effective_from or existing.effective_from,
            effective_to=request.effective_to or existing.effective_to,
        ),
        request.source_batch_id,
    )
    return _reference_response(reference_type, reference_id, "updated", reference)


def maintain_employee_binding(
    binding_id: str,
    request: MasterDataBindingMaintenanceRequest,
    repository: MasterDataPersistenceRepository,
) -> MasterDataBindingMaintenanceResponse:
    if not repository.has_import_batch(request.source_batch_id):
        raise ValueError(f"SOURCE_BATCH_NOT_FOUND: {request.source_batch_id}")

    if request.action == "create":
        return _create_binding(binding_id, request, repository)

    existing = repository.get_employee_binding(binding_id)
    if existing is None:
        raise ValueError(f"BINDING_NOT_FOUND: {binding_id}")

    if request.action == "effective_period":
        _require_binding_fields(request, "effective_from", "effective_to")
        _validate_effective_period(request.effective_from, request.effective_to)
        binding = repository.upsert_employee_binding(
            EmployeeBindingInput(
                binding_id=existing.binding_id,
                employee_id=existing.employee_id,
                supplier_id=existing.supplier_id,
                workplace_id=existing.workplace_id,
                project_id=existing.project_id,
                skill_id=existing.skill_id,
                effective_from=request.effective_from,
                effective_to=request.effective_to,
            ),
            request.source_batch_id,
        )
        return MasterDataBindingMaintenanceResponse(
            binding_id=binding_id,
            action_status="effective_period_updated",
            binding=binding,
        )

    binding = repository.upsert_employee_binding(
        EmployeeBindingInput(
            binding_id=existing.binding_id,
            employee_id=request.employee_id or existing.employee_id,
            supplier_id=request.supplier_id or existing.supplier_id,
            workplace_id=request.workplace_id or existing.workplace_id,
            project_id=request.project_id or existing.project_id,
            skill_id=request.skill_id or existing.skill_id,
            effective_from=request.effective_from or existing.effective_from,
            effective_to=request.effective_to or existing.effective_to,
        ),
        request.source_batch_id,
    )
    return MasterDataBindingMaintenanceResponse(
        binding_id=binding_id,
        action_status="updated",
        binding=binding,
    )


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
            employee_type=request.employee_type or "internal",
            organization_id=request.organization_id,
            workplace_id=request.workplace_id,
            effective_from=request.effective_from,
            effective_to=request.effective_to,
        ),
        request.source_batch_id,
    )
    return _response(employee_id, "created", employee)


def _create_reference(
    reference_type: MasterDataReferenceType,
    reference_id: str,
    request: MasterDataReferenceMaintenanceRequest,
    repository: MasterDataPersistenceRepository,
) -> MasterDataReferenceMaintenanceResponse:
    if repository.get_reference(reference_type, reference_id) is not None:
        raise ValueError(f"REFERENCE_ALREADY_EXISTS: {reference_type}/{reference_id}")
    _require_reference_fields(request, "reference_name", "effective_from", "effective_to")
    _validate_effective_period(request.effective_from, request.effective_to)

    reference = repository.upsert_reference(
        reference_type,
        MasterDataReferenceInput(
            reference_id=reference_id,
            reference_name=request.reference_name,
            status=request.status or "active",
            effective_from=request.effective_from,
            effective_to=request.effective_to,
        ),
        request.source_batch_id,
    )
    return _reference_response(reference_type, reference_id, "created", reference)


def _create_binding(
    binding_id: str,
    request: MasterDataBindingMaintenanceRequest,
    repository: MasterDataPersistenceRepository,
) -> MasterDataBindingMaintenanceResponse:
    if repository.get_employee_binding(binding_id) is not None:
        raise ValueError(f"BINDING_ALREADY_EXISTS: {binding_id}")
    _require_binding_fields(
        request,
        "employee_id",
        "supplier_id",
        "workplace_id",
        "project_id",
        "skill_id",
        "effective_from",
        "effective_to",
    )
    _validate_effective_period(request.effective_from, request.effective_to)

    binding = repository.upsert_employee_binding(
        EmployeeBindingInput(
            binding_id=binding_id,
            employee_id=request.employee_id,
            supplier_id=request.supplier_id,
            workplace_id=request.workplace_id,
            project_id=request.project_id,
            skill_id=request.skill_id,
            effective_from=request.effective_from,
            effective_to=request.effective_to,
        ),
        request.source_batch_id,
    )
    return MasterDataBindingMaintenanceResponse(
        binding_id=binding_id,
        action_status="created",
        binding=binding,
    )


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


def _require_reference_fields(
    request: MasterDataReferenceMaintenanceRequest,
    *field_names: str,
) -> None:
    missing = [
        field_name
        for field_name in field_names
        if getattr(request, field_name) in (None, "")
    ]
    if missing:
        raise ValueError(f"MISSING_REQUIRED_FIELD: {','.join(missing)}")


def _require_binding_fields(
    request: MasterDataBindingMaintenanceRequest,
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


def _reference_response(
    reference_type: MasterDataReferenceType,
    reference_id: str,
    action_status: str,
    reference: MasterDataReferenceRecord,
) -> MasterDataReferenceMaintenanceResponse:
    return MasterDataReferenceMaintenanceResponse(
        reference_type=reference_type,
        reference_id=reference_id,
        action_status=action_status,
        reference=reference,
    )
