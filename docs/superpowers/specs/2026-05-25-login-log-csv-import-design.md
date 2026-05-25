# Login Log CSV Import Design

## Goal

Build the third local upload/import vertical for login logs. It should mirror the demand forecast and personnel schedule CSV import paths while using login-session fields and keeping all results in FastAPI process memory.

## Scope

- Add a local `POST /api/v1/import-batches/login-log` route.
- Parse CSV with Python standard library only.
- Validate required login log fields: `login_log_id`, `employee_id`, `business_date`, `login_at`, `logout_at`, `workplace_id`, `project_id`, and `source_system`.
- Reject rows where `login_at` is not before `logout_at`.
- Store `ImportBatchResult` in the existing process-memory import batch store.
- Add a frontend upload mode for login log CSV and map the resulting batch into the existing import batch detail page.

## Out Of Scope

- No database, ORM, migration, production persistence, or file storage.
- No Excel xlsx parsing or new dependency.
- No real CORN, HR, WFM, or third-party integration.
- No auth, permission, approval, export, batch operation, automatic scheduling, settlement, charge factor, or production formula behavior.
- No production status dictionary or cross-day business-day calculation.

## UI Shape

Use the existing import batch upload page. `/import-batches/new` gains a `login-log` mode that shows login-log required CSV fields and submits through a server action to the new backend route.

## Acceptance

- Backend tests prove valid rows succeed, missing required fields create failure rows, and invalid time ranges create failure rows.
- Frontend model tests prove `login_log` results map to the login log template, affected objects, impact copy, and upload helper.
- Browser/API smoke proves a mixed CSV batch can be created and viewed.
- Final `bash scripts/check.sh` passes after traceability updates.
