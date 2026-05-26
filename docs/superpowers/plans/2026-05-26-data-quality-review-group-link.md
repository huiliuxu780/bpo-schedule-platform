# Data Quality Review Group Link Plan

1. Register `US557-US559/F391-Q109` in current state and traceability.
2. Add failing tests for the quality-group link helper and page source coverage.
3. Implement a local read-only group-link summary in `lib/data-quality-groups.ts`.
4. Render the summary on `/data-quality` after the import-batch impact card.
5. Run targeted tests, strict state check, page smoke, diff check, and full `bash scripts/check.sh`.
6. Clear current state after completion, update audit/task/branch logs, and commit locally.
