# Import Batches Process List Design

## Goal

Make the import batch list show CSV import batches created in the current FastAPI process, while keeping the existing fallback list for local stability.

## Scope

- Add `GET /api/v1/import-batches`.
- Return process-memory `ImportBatchResult` rows sorted by `uploaded_at` descending.
- Update the frontend import batch list data client to fetch the backend list first.
- Merge backend rows before existing fallback rows and deduplicate by batch ID.
- Preserve existing fallback behavior when the backend list is unavailable or empty.

## Out Of Scope

- No database, ORM, migration, production persistence, file storage, new dependency, real external integration, auth, permission, approval, export, batch operation, Excel xlsx parsing, production status dictionary, automatic scheduling, settlement, charge factor, or production formula.

## Acceptance

- Backend route is registered.
- Backend list returns imported process-memory batches after a CSV import.
- Frontend model tests prove API rows appear before fallback rows.
- Frontend model tests prove fallback still appears when fetch fails.
- Browser smoke confirms a newly uploaded status log batch appears on `/import-batches`.
