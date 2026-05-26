# Data Quality Group Exception Coverage Plan

1. Register `US560-US562/F392-Q110` in current state and traceability.
2. Add failing tests for the group exception coverage helper and page source coverage.
3. Implement a local read-only group exception coverage summary in `lib/data-quality-groups.ts`.
4. Render the summary on `/data-quality` near the quality group cards.
5. Run targeted tests, strict state check, page smoke, diff check, and full `bash scripts/check.sh`.
6. Clear current state after completion, update audit/task/branch logs, and commit locally.
