# Import Correction Readiness Design

## Context

The import batch detail page now shows failure reason grouping and quality impact rollup. The next local-only supervisor view is a concise correction readiness summary that translates those sections into a practical review order without creating any write capability.

## Scope

- Add a frontend model helper that accepts an `ImportBatch` and data-quality issue rows.
- Reuse existing failure reason and quality impact summary helpers.
- Derive readiness level, primary field, confirmation objects, risk note, recommended review steps, and deferred action boundaries.
- Render the summary on the import batch detail page after “质量影响聚合” and before “失败行明细”.

## Boundaries

- No backend endpoint.
- No database, ORM, migration, or production persistence.
- No repair submission, save, approval, export, batch operation, permission, production status dictionary, settlement rule, charge factor, or production formula.
- No new dependencies or package/lockfile changes.

## UI Behavior

When failure rows exist, the page shows “修正准备摘要” with:

- 准备等级
- 首要字段
- 需确认对象
- 风险提示
- 建议查看顺序
- 暂缓能力提示

When there are no failure rows, the summary exposes a neutral empty state and does not imply any correction action.

## Testing

- Add model tests for high-risk linked issues and unlinked failure rows.
- Add empty-state model coverage for clean batches.
- Run product copy and navigation audits, typecheck, page smoke, strict state check, and final project check.
