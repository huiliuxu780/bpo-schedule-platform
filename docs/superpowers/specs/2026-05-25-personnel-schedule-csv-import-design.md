# Personnel Schedule CSV Import Design

## Goal

Build the second local upload/import vertical for personnel-level schedules. It should mirror the demand forecast CSV import path while using the personnel schedule contract fields and keeping all results in FastAPI process memory.

## Scope

- Add a local `POST /api/v1/import-batches/personnel-schedule` route.
- Parse CSV with Python standard library only.
- Validate required personnel schedule fields: `schedule_detail_id`, `schedule_version_id`, `employee_id`, `business_date`, `workplace_id`, `supplier_id`, `project_id`, `shift_type_id`, `start_at`, `end_at`, and `status`.
- Reject rows where `start_at` is not before `end_at`.
- Store `ImportBatchResult` in the existing process-memory import batch store.
- Add a frontend upload mode for personnel schedule CSV and map the resulting batch into the existing import batch detail page.

## Out Of Scope

- No database, ORM, migration, production persistence, or file storage.
- No Excel xlsx parsing or new dependency.
- No real HR, WFM, CORN, or third-party integration.
- No auth, permission, approval, export, batch operation, automatic scheduling, settlement, charge factor, or production formula behavior.

## UI Shape

Use the existing import batch surfaces. `/import-batches/new` becomes a two-mode page with links for demand forecast and personnel schedule. The personnel schedule mode shows required CSV fields and submits through a server action to the new backend route.

## Acceptance

- Backend tests prove valid rows succeed, missing required fields create failure rows, and invalid time ranges create failure rows.
- Frontend model tests prove `personnel_schedule` results map to the personnel schedule template, affected objects, impact copy, and upload payload helper.
- Browser/API smoke proves a mixed CSV batch can be created and viewed.
- Final `bash scripts/check.sh` passes after traceability updates.
