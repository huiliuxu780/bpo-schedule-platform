# Status Log CSV Import Design

## Goal

Add a local-only status log CSV upload/import vertical that mirrors the existing demand forecast, personnel schedule, and login log CSV import flows.

## Scope

- Add `POST /api/v1/import-batches/status-log`.
- Accept `file_name`, `uploaded_by`, and `csv_content`.
- Parse CSV with Python standard-library `csv.DictReader`.
- Store generated `ImportBatchResult` in FastAPI process memory.
- Validate required headers and required row fields.
- Validate `start_at` and `end_at` as ISO datetimes and require `end_at > start_at`.
- Add a status-log mode to `/import-batches/new`.
- Map backend `entity: status_log` to the status-log template and batch detail copy.

## Out Of Scope

- No database, ORM, migration, persistence, production file storage, new dependency, real CORN/HR/WFM integration, auth, permission, approval, export, batch operation, Excel xlsx parsing, production status dictionary, automatic scheduling, settlement, charge factor, or production formula.

## CSV Contract

Required headers:

- `status_log_id`
- `employee_id`
- `business_date`
- `status_type`
- `start_at`
- `end_at`
- `workplace_id`
- `project_id`
- `source_system`

## Acceptance

- Backend route is registered and returns `ImportBatchResult`.
- Valid rows produce `completed`.
- Missing required values produce `completed_with_errors` with `missing_required_field`.
- Invalid or reversed status times produce `invalid_time_range` on `end_at`.
- Frontend upload page exposes status-log mode and required fields.
- Batch detail maps `status_log` to `状态日志模板`.
