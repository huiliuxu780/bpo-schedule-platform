# Demand Forecast CSV Import Design

## Goal

Start the first real upload/import Gate with one narrow vertical: demand forecast CSV upload, standard-library parsing, process-memory batch result storage, and batch detail review.

## Scope

This Gate implements only demand forecast CSV. It does not implement Excel xlsx parsing, database persistence, ORM, migrations, real external integrations, auth, permissions, approval, export, batch operations, automatic scheduling, settlement, charge factors, or production formulas.

## Approach

The browser page receives a user-selected CSV file through a file input. A Next server action reads the file text and sends JSON to FastAPI with `file_name`, `uploaded_by`, and `csv_content`, avoiding a new `python-multipart` dependency. FastAPI parses CSV with Python `csv.DictReader`, validates required fields, creates a batch id, records success and failure rows, and stores results in process memory.

## Data Contract

Required CSV headers:

- `business_date`
- `workplace_id`
- `project_id`
- `interval_start`
- `interval_end`
- `forecast_agents`

Failure rows include `batch_id`, `failed_row_number`, `field_name`, `error_code`, `error_message`, and `raw_value`.

## UI Flow

`/import-batches` gains an upload entry. `/import-batches/new` accepts a CSV file and owner. On successful submit it redirects to `/import-batches/{batchId}`. Batch detail shows total rows, success rows, failed rows, warning rows, error codes, and failure row details.

## Testing

Backend unittest covers route registration, valid CSV import, missing required field, invalid number, malformed empty content, process-memory retrieval, and no database/dependency boundary. Frontend model tests cover mapping backend batch results into import batch history. Browser smoke covers the upload form and batch detail result with a small CSV file.
